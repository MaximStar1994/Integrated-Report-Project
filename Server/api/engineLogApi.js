const ServiceManager = require('../services/ServiceManager.js')
const { uuid } = require('uuidv4');
const path = require('path');
const fs = require('fs');
const PizZip = require('pizzip');
const Docxtemplater = require("docxtemplater");
const ImageModule = require('open-docxtemplater-image-module');
const libre = require('libreoffice-convert');
const moment = require('moment-timezone')
const config = require('../config/config');
const {info,err : ErrorLog} = require("../common/log")

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
var opts = {}
opts.centered = false;
opts.fileType = "docx";

opts.getImage = function(tagValue, tagName) {
    return base64DataURLToArrayBuffer(tagValue);
}
opts.getSize = function(img, tagValue, tagName) {
    return [150, 100];
}

const nestedAssign = (target, source) => {
    Object.keys(source).forEach(key => {
        const s_val = source[key]
        const t_val = target[key]
        target[key] = t_val && s_val && typeof t_val === 'object' && typeof s_val === 'object' ? nestedAssign(t_val, s_val) : s_val
    })
    return target
}
class EngineLogApi {
    constructor () {
        this.serviceManager = new ServiceManager()
    }
    CanViewElogPage(userlock, callback) {
        var elogService = this.serviceManager.GetEngineLogApi()
        elogService.CanViewElogPage(userlock,(canView,err) => {
            if (!canView) {
                err = "Another device is accessing this page now"
                callback(null, err)
            } else {
                elogService.LockElogPage(callback)
            }
        })
    }
    UnlockEngineLogPage(userLock, callback) {
        var elogService = this.serviceManager.GetEngineLogApi()
        elogService.CanViewElogPage(userLock,(canView,err) => {
            if (!canView) {
                err = "Another device is accessing this page now"
                callback(null, err)
            } else {
                elogService.UnlockElogPage(callback)
            }
        })
    }
    GetEngineLogData(callback) {
        var elogService = this.serviceManager.GetEngineLogApi()
        elogService.GetEngineLogTagRelatedData(callback)
    }
    GetEngineLog(engineLogId,callback) {
        var elogService = this.serviceManager.GetEngineLogApi()
        elogService.GetEngineLog(engineLogId, callback)
    }
    CreateEngineLog (callback) {
        var elogService = this.serviceManager.GetEngineLogApi()
        elogService.CreateEngineLog(callback)
    }
    PostEngineLog(newLog, callback, retried = false) {
        var elogService = this.serviceManager.GetEngineLogApi()
        elogService.GetEngineLog(newLog.elogId, (dbLog) => {
            if (dbLog) {
                dbLog = nestedAssign(dbLog, newLog)
                elogService.UpdateEngineLog(dbLog, callback)
            } else {
                if (retried) {
                    callback(null,"Failed to post engine log")
                    return
                }
                this.CreateEngineLog((rtn,err) => {
                    var elogId = rtn.elogId
                    newLog.elogId = elogId
                    this.PostEngineLog(newLog, callback, true)
                })
            }
        })
    }
    ListEngineLogs(callback) {
        var elogService = this.serviceManager.GetEngineLogApi()
        elogService.ListEngineLogs(callback)
    }
    GetEngineLogForToday(callback) {
        var elogService = this.serviceManager.GetEngineLogApi()
        elogService.GetEngineLogsForToday(callback)
    }
    ListEngineLogsOffline(callback) {
        var elogService = this.serviceManager.GetEngineLogApi()
        elogService.ListEngineLogsOffline(callback)
    }
    SyncEngineLogs(offlineLogs, callback) {
        this.SyncPastEngineLogs(offlineLogs, () => {
            var elogService = this.serviceManager.GetEngineLogApi()
            this.ListEngineLogsOffline(callback)
        })
    }
    
    SyncPastEngineLogs(offlineLogs, callback) {
        var elogService = this.serviceManager.GetEngineLogApi()
        if (offlineLogs instanceof Array && offlineLogs.length > 0) {
            var queriesToDo = offlineLogs.length
            offlineLogs.forEach(log => {
                var newLog = log
                elogService.GetEngineLogByGeneratedDate(log.generatedDate, (sqldblogs,err) => {
                    var currElog = sqldblogs.find(dblog => dblog.timeInterval == newLog.timeInterval)
                    if (sqldblogs.length == 0 || currElog == null) {
                        this.CreateEngineLog((rtn,err) => {
                            var elogId = rtn.elogId
                            newLog.elogId = elogId
                            this.PostEngineLog(newLog, (rtn,err) => {
                                queriesToDo -= 1
                                if (queriesToDo == 0) { callback(rtn,err) }
                            }, true)
                        })
                    } else {
                        elogService.GetEngineLog(currElog.elogId, (dbLog) => {
                            if (dbLog == null) {
                                this.CreateEngineLog((rtn,err) => {
                                    var elogId = rtn.elogId
                                    newLog.elogId = elogId
                                    this.PostEngineLog(newLog, (rtn,err) => {
                                        queriesToDo -= 1
                                        if (queriesToDo == 0) { callback(rtn,err) }
                                    }, true)
                                })
                            } else {
                                dbLog = nestedAssign(dbLog, newLog)
                                elogService.UpdateEngineLog(dbLog, (rtn,err) => {
                                    queriesToDo -= 1
                                    if (queriesToDo == 0) { callback(rtn,err) }
                                })
                            }
                        })
                    }
                })
            })
        } else {
            callback({},null)
        }
    }
    GenerateElogForOldLogs(callback) {
        var elogService = this.serviceManager.GetEngineLogApi()
        // get all old logs that have no generated filepath and has signature
        elogService.ListEngineLogsEligibleForPDF((eligibleLogs) => {
            if (eligibleLogs.length == 0) {
                callback()
            } else {
                var queries = eligibleLogs.length
                eligibleLogs.forEach(logForDay => {
                    for (const [key, value] of Object.entries(logForDay)) {
					  if(value){
						if(value.general && value.general.departureTime){
							value.general.departureTime = moment(value.general.departureTime).format("DD-MMM-YY HH:mm");
						}
						if(value.general && value.general.arrivalTime){
							value.general.arrivalTime = moment(value.general.arrivalTime).format("DD-MMM-YY HH:mm");
						}
					  }
					}
                    this.GeneratePDF(logForDay, () => {
                        queries -= 1
                        if (queries == 0) {
                            callback()
                        }
                    })
                })
            }
        })
    }
    GeneratePDF(logForDay, callback) {
        info("EngineLog report pdf generation starts");
        const reportDir = 'enginelog'
        const relativeDir = uuid()
        const dirPath = path.join(config.kstConfig.filesLocation,reportDir,relativeDir)
        var content = fs.readFileSync(path.resolve('public','template', 'eLogTemplate.docx'), 'binary');
        var zip = new PizZip(content);
        var imageModule = new ImageModule(opts);
        info("EngineLog report creating word file");
        var doc = new Docxtemplater(zip,{modules : [imageModule], nullGetter: function(){return "";}});
        doc.setData(logForDay);
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
            info("EngineLog report converting word file into pdf");
            fs.writeFileSync(pdfPath, done);
            fs.unlink(docPath, () => {})
            if(err == null){
                pdfPath = pdfPath.replace(config.kstConfig.fileLocationWithoutPublic, "");
                pdfPath = pdfPath.replace(/\\/g,"/")
                var queries = 2
                var elogIds = []
                if (logForDay[0] != null) {
                    elogIds.push(logForDay[0].elogId)
                }
                if (logForDay[1] != null) {
                    elogIds.push(logForDay[1].elogId)
                }
                if (logForDay[2] != null) {
                    elogIds.push(logForDay[2].elogId)
                }
                if (logForDay[3] != null) {
                    elogIds.push(logForDay[3].elogId)
                }
                if (logForDay[4] != null) {
                    elogIds.push(logForDay[4].elogId)
                }
                if (logForDay[5] != null) {
                    elogIds.push(logForDay[5].elogId)
                }
                // record elog path
                this.serviceManager.GetEngineLogApi().RecordEngineLog(elogIds, pdfPath, (res,err) => {
                    queries -= 1
                    if (queries == 0) {callback({filePath : pdfPath},err)}
                })
                info("EngineLog report file path stored into the database");
                this.serviceManager.GetDocumentApi().CreateFile({name : pdfname, relativeDir : relativeDir},10,() => {
                    queries -= 1
                    if (queries == 0) {callback({filePath : pdfPath},err)}
                })
            }
        })
    }
}
module.exports = EngineLogApi;