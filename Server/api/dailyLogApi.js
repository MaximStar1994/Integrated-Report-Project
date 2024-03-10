const ServiceManager = require('../services/ServiceManager.js')
const { uuid } = require('uuidv4');
const path = require('path');
const fs = require('fs');
const PizZip = require('pizzip');
const Docxtemplater = require("docxtemplater");
const ImageModule = require('open-docxtemplater-image-module');
const libre = require('libreoffice-convert');
const moment = require('moment-timezone')
const {base64DataURLToArrayBuffer, nestedAssign } = require("../helper/helperWithoutApi");
const helper = require('../helper/helper.js');
const permissionController = require('./permissionController')
const config = require('../config/config');
const {info,err : ErrorLog} = require("../common/log");

const opts = {
    centered : false,
    fileType : "docx",
    getImage : (tagValue, tagName) => {
        return base64DataURLToArrayBuffer(tagValue);
    },
    getSize : (img, tagValue, tagName) => {
        return [400, 100];
    }
}

opts.getSize=function(img,tagValue, tagName) {
    return [150,150];
}

class DailyLogApi {
    constructor () {
        this.serviceManager = new ServiceManager()
    }
    async CanViewDailyLogPage(userlock, vesselId) {
        var dailyLogPageService = this.serviceManager.GetDailyLogService()
        return await dailyLogPageService.CanViewDailyLogPage(vesselId, userlock);
    }
    async GetVessel(vesselID) {
        var dailyLogPageService = this.serviceManager.GetDailyLogService()
        return await dailyLogPageService.GetVessel(vesselID);
    }
    async GetGeneratorStructure(vesselID) {
        var dailyLogPageService = this.serviceManager.GetDailyLogService()
        return await dailyLogPageService.GetGeneratorStructure(vesselID);
    }
    async GetRobStructure(vesselID) {
        var dailyLogPageService = this.serviceManager.GetDailyLogService()
        return await dailyLogPageService.GetRobStructure(vesselID);
    }
    async GetTankSounding(vesselID) {
        var dailyLogPageService = this.serviceManager.GetDailyLogService()
        return await dailyLogPageService.GetTankSounding(vesselID);
    }
    async GetVesselName(vesselID) {
        var dailyLogPageService = this.serviceManager.GetDailyLogService()
        return await dailyLogPageService.GetVesselName(vesselID);
    }
    async UnlockDailyLogPage(userlock, vesselId) {
        var dailyLogPageService = this.serviceManager.GetDailyLogService()
        let canview = await dailyLogPageService.CanViewDailyLogPage(vesselId, userlock)
        if (canview) {
            return await dailyLogPageService.UnlockDailyLogPage(vesselId)
        } else {
            throw new Error("Another device is accessing this page now")
        }
    }
    async LockDailyLogPage(userlock, vesselId, accountType) {
        var canview = true;
        var dailyLogPageService = this.serviceManager.GetDailyLogService()
        if (accountType !== "vessel") {
            canview = await dailyLogPageService.CanViewDailyLogPage(vesselId, userlock)
        }
        if (canview) {
            return dailyLogPageService.LockDailyLogPage(vesselId)
        } else {
            throw new Error("Another device is accessing this page now")
        }
    }
    async GetDailyLog(reportId) {
        var dailyLogPageService = this.serviceManager.GetDailyLogService()
        return dailyLogPageService.GetDailyLog(reportId)
    }
    async ValidateDailyLog(dailyLog) {
        if (helper.IsEmpty(dailyLog.vesselId)) {
            throw new Error("Missing Vessel Id")
        }
        return true
    }
    async SyncDailyLog(user, report) {
        await this.ValidateDailyLog(report)
        if (!permissionController.canCreateLogForVessel(user, report.vesselId)) {
            throw new Error("Unauthorized")
        }
        var dailyLogPageService = this.serviceManager.GetDailyLogService()
        if (helper.IsEmpty(report.formId)) {
            return await dailyLogPageService.CreateDailyLog(report)
        } else {
            return report
        }
    }
    async SyncDailyLogs(user, reports) {
        if (reports instanceof Array && reports.length > 0) {
            return await Promise.all(reports.map(report => {
                return this.SyncDailyLog(user, report)
            }))
        } else {
            return []
        }
    }
    async UpdateFilePathForDailyLog(reportId, filepath) {
        var dailyLogPageService = this.serviceManager.GetDailyLogService()
        return await dailyLogPageService.UpdateDailyLogFilePath(reportId, filepath)
    }
    async ListDailyLogs(vesselId){
        var dailyLogPageService = this.serviceManager.GetDailyLogService()
        return await dailyLogPageService.ListDailyLogs(vesselId)
    }
    async ListDailyLog(vesselId){
        var dailyLogPageService = this.serviceManager.GetDailyLogService()
        return await dailyLogPageService.ListDailyLog(vesselId)
    }
    async ModifyData(report) {
        report.formDate = moment(report.formDate).format('DD-MM-YYYY');
        report.engines.forEach(engine=> {
            engine[engine.engineIdentifier] = true;
            if(report.vesselId===10||report.vesselId===11){
                engine.LNGProperties = true;
            }
        })
        report.generators.forEach(generator=> {
            generator[generator.generatorIdentifier] = true;
        })
        let robStructure = await this.GetRobStructure(report.vesselId);
        report.rob.forEach(element=> {
            let tempRob = robStructure.filter(robstruct => robstruct.rob_identifier===element.identifier);
            if(tempRob.length>0){
                element[tempRob[0].orderid] = true;
            }
            if(element.identifier==='LNG'){
                element['unit'] = 'kg'
            }
            else{
                element['unit'] = 'l'
            }
        })
        let tankSoundingStructure = await this.GetTankSounding(report.vesselId);
        report.tanksoundings.forEach(tank=> {
            let temp = tankSoundingStructure.filter(tankStructure => tankStructure.identifier===tank.identifier);
            if(temp.length>0){
                tank['maxDepth'] = temp[0].max_depth;
                tank['maxVolume'] = temp[0].max_volume;
                tank[temp[0].orderid] = true;
            }
        })
        let vesselName = await this.GetVesselName(report.vesselId);
        report.vesselName = vesselName;
        return report;
    }
    async GenerateDailyLogsForOldLogs() {
        var eligibleReports = await this.serviceManager.GetDailyLogService().ListDailyLogEligibleForPDF()
        if(eligibleReports.length === 0){
            return null;
        }
        else {
            for (let report of eligibleReports){
                let temp = await this.ModifyData(report);
                await this.GeneratePDF(temp);
            }
            return null;
        }
    }
    
    GeneratePDF(report) {
        info("Dailylog report pdf generation starts");
        try{
            const reportDir = report.vesselName + '\\dailyLog'
            const relativeDir = uuid()
            const dirPath = path.join(config.kstConfig.filesLocation,reportDir,relativeDir)
            var content = fs.readFileSync(path.resolve('public','template', 'DailyLogTemplate.docx'), 'binary');
            var imageModule = new ImageModule(opts);
            var zip = new PizZip(content);
            info("Dailylog report creating word file");
            var doc = new Docxtemplater(zip,{modules : [imageModule], nullGetter: function(){return "";}});
            doc.setData(report);
            doc.render()
            var buf = doc.getZip().generate({type: 'nodebuffer'});
            fs.mkdirSync(dirPath, { recursive: true });
            var filename = uuid()
            var pdfname = filename + ".pdf"
            var docname = filename + ".docx"
            var docPath = path.join(dirPath,docname)
            var pdfPath = path.join(dirPath,pdfname)
            fs.writeFileSync(docPath, buf)
            return new Promise(resolve =>
                libre.convert(buf, ".pdf", undefined, async (err, done) => {
                    info("Dailylog report converting word file into pdf");
                fs.writeFileSync(pdfPath, done);
                fs.unlink(docPath, () => {})
                if(err == null){
                    pdfPath = pdfPath.replace(config.kstConfig.fileLocationWithoutPublic, "");
                    pdfPath = pdfPath.replace(/\\/g,"/")
                    await this.serviceManager.GetDailyLogService().UpdateDailyLogFilePath(report.formId, pdfPath);
                    info("Dailylog report file path stored into the database");
                    resolve({filePath : pdfPath});
                    // this.serviceManager.CreateFile({name : pdfname, relativeDir : relativeDir},10,() => {
                    //     queries -= 1
                    //     if (queries == 0) {callback({filePath : pdfPath},err)}
                    // })
                }
            })
            );
        }catch (e) {
            ErrorLog(`Dailylog report pdf generation error block : ${e}`);
            // e.properties.errors.map(error => console.log("Errors detected in generating PDF", error));
        }
    }
}
module.exports = new DailyLogApi();