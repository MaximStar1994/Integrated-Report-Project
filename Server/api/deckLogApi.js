const ServiceManager = require('../services/ServiceManager.js')
const { uuid } = require('uuidv4');
const path = require('path');
const fs = require('fs');
const PizZip = require('pizzip');
const Docxtemplater = require("docxtemplater");
const ImageModule = require('open-docxtemplater-image-module');
const libre = require('libreoffice-convert');
const config = require('../config/config');
const {info,err : ErrorLog} = require("../common/log");

const hourlyIntervalsList = {
    0: '0000 - 0059',
    1: '0100 - 0159',
    2: '0200 - 0259',
    3: '0300 - 0359',
    4: '0400 - 0459',
    5: '0500 - 0559',
    6: '0600 - 0659',
    7: '0700 - 0759',
    8: '0800 - 0859',
    9: '0900 - 0959',
    10: '1000 - 1059',
    11: '1100 - 1159',
    12: '1200 - 1259',
    13: '1300 - 1359',
    14: '1400 - 1459',
    15: '1500 - 1559',
    16: '1600 - 1659',
    17: '1700 - 1759',
    18: '1800 - 1859',
    19: '1900 - 1959',
    20: '2000 - 2059',
    21: '2100 - 2159',
    22: '2200 - 2259',
    23: '2300 - 2359',
}

const fourHourlyIntervalsList = {
    0: '0000 - 0359',
    1: '0400 - 0759',
    2: '0800 - 1159',
    3: '1200 - 1559',
    4: '1600 - 1959',
    5: '2000 - 2359',
}

function base64DataURLToArrayBuffer(dataURL) {
    const base64Regex = /^data:image\/(png|jpg|svg|svg\+xml);base64,/;
    if (!base64Regex.test(dataURL)) {
      return false;
    }
    const stringBase64 = dataURL.replace(base64Regex, "");
    let binaryString;
    if (typeof window !== "undefined") {
      binaryString = window.atob(stringBase64);
    } else {
      binaryString = new Buffer(stringBase64, "base64").toString("binary");
    }
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes.buffer;
}


const nestedAssign = (target, source) => {
    Object.keys(source).forEach(key => {
        const s_val = source[key]
        const t_val = target[key]
        target[key] = t_val && s_val && typeof t_val === 'object' && typeof s_val === 'object' ? nestedAssign(t_val, s_val) : s_val
    })
    return target
}
class DeckLogApi {
    constructor () {
        this.serviceManager = new ServiceManager()
    }
    CanViewDeckLogPage(userlock, callback) {
        var decklogService = this.serviceManager.GetDeckLogApi()
        decklogService.CanViewDecklogPage(userlock,(canView,err) => {
            if (!canView) {
                err = "Another device is accessing this page now"
                callback(null, err)
            } else {
                decklogService.LockDecklogPage(callback)
            }
        })
    }
    UnlockDeckLogPage(userLock, callback) {
        var decklogService = this.serviceManager.GetDeckLogApi()
        decklogService.CanViewDecklogPage(userLock,(canView,err) => {
            if (!canView) {
                err = "Another device is accessing this page now"
                callback(null, err)
            } else {
                decklogService.UnlockDeckLogPage(callback)
            }
        })
    }
    ListDeckLogs(callback) {
        var decklogService = this.serviceManager.GetDeckLogApi()
        decklogService.ListDeckLogs(callback)
    }
    SyncDeckLogs(offlineLogs, callback) {
        this.SyncPastDeckLogs(offlineLogs, () => {
            this.ListDeckLogs(callback)
        })
    }
    SyncPastDeckLogs(offlineLogs, callback) {
        var decklogService = this.serviceManager.GetDeckLogApi()
        if (offlineLogs instanceof Array && offlineLogs.length > 0) {
            var queriesToDo = offlineLogs.length
            offlineLogs.forEach(log => {
                let newLog = log
                decklogService.GetDeckLogByGeneratedDate(log.generatedDate, (sqldblogs,err) => {
                    if (sqldblogs.length == 0) {
                        decklogService.CreateDeckLog(newLog,(rtn,err) => {
                            queriesToDo -= 1
                            if (queriesToDo == 0) { callback(offlineLogs,err) }
                        })
                    } else {
                        decklogService.GetDeckLog(sqldblogs[0].decklogId, (dbLog) => {
                            dbLog = nestedAssign(dbLog, newLog)
                            decklogService.UpdateDeckLog(dbLog, (rtn,err) => {
                                queriesToDo -= 1
                                if (queriesToDo == 0) { callback(offlineLogs,err) }
                            })
                        })
                    }
                })
            })
        } else {
            callback([],null)
        }
    }
    GetDeckLog(decklogId, callback) {
        this.serviceManager.GetDeckLogApi().GetDeckLog(decklogId, callback)
    }
    GenerateDeckLogForOldLogs(callback) {
        var deckLogService = this.serviceManager.GetDeckLogApi()
        deckLogService.ListDeckLogsEligibleForPDF((eligibleLogs) => {
            if (eligibleLogs.length == 0) {
                callback()
            } else {
                this.GeneratePDFs(eligibleLogs, () => {
                    callback()
                })
            }
        })
    }
    ModifyData(data){
        var keys = Object.keys(data.daily.tank1)
        keys.forEach(key => {
            data.daily.tank1[key] = data.daily.tank1[key] || ''
        })
        var keys = Object.keys(data.daily.tank2)
        keys.forEach(key => {
            data.daily.tank2[key] = data.daily.tank2[key] || ''
        })
        var keys = Object.keys(data.daily.sounding)
        keys.forEach(key => {
            data.daily.sounding[key] = data.daily.sounding[key] || ''
        })
        var keys = Object.keys(data.daily.draft)
        keys.forEach(key => {
            data.daily.draft[key] = data.daily.draft[key] || ''
        })
        var keys = Object.keys(data.daily.voidspaceSounding)
        keys.forEach(key => {
            data.daily.voidspaceSounding[key] = data.daily.voidspaceSounding[key] || ''
        })
        data.fourHourly.forEach((fourHourlyGroupInfo, index) => {
            fourHourlyGroupInfo['headersObj'] = {};
            fourHourlyGroupInfo['infoArr'] = [];
            fourHourlyGroupInfo[`${fourHourlyGroupInfo.name}`] = true;
            fourHourlyGroupInfo.headers.forEach((header, idx) => {fourHourlyGroupInfo['headersObj'][`column_${idx+1}`] = header});
            fourHourlyGroupInfo.info.forEach((infoData, idx) => {
                infoData.timeInterval = fourHourlyIntervalsList[infoData.timeInterval];
                let temp = {timeInterval: infoData.timeInterval};
                for (const [key, value] of Object.entries(fourHourlyGroupInfo['headersObj'])) {
                    temp[key] = infoData.info[value];
                }
                fourHourlyGroupInfo['infoArr'].push(temp);
            });
            for (const [key, value] of Object.entries(fourHourlyGroupInfo['headersObj'])) {
                if(key===value)fourHourlyGroupInfo['headersObj'][key] = "";
            }
        });
        data.hourly.forEach(row => row.timeInterval = hourlyIntervalsList[row.timeInterval]);
        data.additionalCol.forEach(row => row[`${row.name}`] = true);
        return data;
    }
    
    GeneratePDFs(decklogs, callback) {
        info("Decklog report pdf generation starts");
        if (decklogs.length == 0) {
            callback()
            return
        }
        let decklog = this.ModifyData(decklogs[0]);
        const reportDir = 'decklog'
        const relativeDir = uuid()
        const dirPath = path.join(config.kstConfig.filesLocation,reportDir,relativeDir)
        var content = fs.readFileSync(path.resolve('public','template', 'deckLogTemplate.docx'), 'binary');
        var zip = new PizZip(content);
        var opts = {}
        opts.centered = false;
        opts.fileType = "docx";
        opts.getImage = function(tagValue, tagName) {
            return base64DataURLToArrayBuffer(tagValue);
        }
        opts.getSize = function(img, tagValue, tagName) {
            return [150, 100];
        }
        var imageModule = new ImageModule(opts);
        info("Decklog report creating word file");
        var doc = new Docxtemplater(zip,{modules : [imageModule], nullGetter: function(){return "";}});
        doc.setData(decklog);
        doc.render()
        var buf = doc.getZip().generate({type: 'nodebuffer'});
        fs.mkdirSync(dirPath, { recursive: true });
        var filename = uuid()
        var pdfname = filename + ".pdf"
        var docname = filename + ".docx"
        var docPath = path.join(dirPath,docname)
        var pdfPath = path.join(dirPath,pdfname)
        fs.writeFileSync(docPath, buf)
        libre.convert(buf, ".pdf", undefined, (err, done) => {
            info("Decklog report converting word file into pdf");
            fs.writeFileSync(pdfPath, done);
            fs.unlink(docPath, () => {})
            if(err == null){
                pdfPath = pdfPath.replace(config.kstConfig.fileLocationWithoutPublic, "");
                pdfPath = pdfPath.replace(/\\/g,"/")
                var queries = 2
                var remainingDecklogs = decklogs
                remainingDecklogs.shift()
                this.serviceManager.GetDeckLogApi().RecordDeckLog(decklog.decklogId, pdfPath, (res,err) => {
                    queries -= 1
                    if (queries == 0) {
                        this.GeneratePDFs(remainingDecklogs,callback)
                    }
                })
                info("Decklog report file path stored into the database");
                this.serviceManager.GetDocumentApi().CreateFile({name : pdfname, relativeDir : relativeDir},51,() => {
                    queries -= 1
                    if (queries == 0) {
                        this.GeneratePDFs(remainingDecklogs,callback)
                    }
                })
            }
        })
    }
}
module.exports = DeckLogApi;