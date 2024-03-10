const ServiceManager = require('../services/ServiceManager.js')
const { uuid } = require('uuidv4');
const path = require('path');
const fs = require('fs');
const PizZip = require('pizzip');
const Docxtemplater = require("docxtemplater");
const ImageModule = require('open-docxtemplater-image-module');
const libre = require('libreoffice-convert');
const moment = require('moment-timezone')
const { nestedAssign, opts } = require("../helper/helperWithoutApi");
const helper = require('../helper/helper.js');
const permissionController = require('./permissionController')
const config = require('../config/config');
const {info,err : ErrorLog} = require("../common/log")

class VesselDisinfectionApi {
    constructor () {
        this.serviceManager = new ServiceManager()
    }
    async CheckSubmissionForToday(vesselId) {
        var vesselDisinfectionReportService = this.serviceManager.GetVesselDisinfectionService()
        return await vesselDisinfectionReportService.CheckSubmissionForToday(vesselId);
    }
    async CanViewVesselDisinfectionPage(userlock, vesselId) {
        var vesselDisinfectionReportService = this.serviceManager.GetVesselDisinfectionService()
        return await vesselDisinfectionReportService.CanViewVesselDisinfectionPage(vesselId, userlock);
    }
    async UnlockVesselDisinfectionPage(userlock, vesselId) {
        var vesselDisinfectionReportService = this.serviceManager.GetVesselDisinfectionService()
        let canview = await vesselDisinfectionReportService.CanViewVesselDisinfectionPage(vesselId, userlock)
        if (canview) {
            return await vesselDisinfectionReportService.UnlockVesselDisinfectionPage(vesselId)
        } else {
            throw new Error("Another device is accessing this page now")
        }
    }
    async LockVesselDisinfectionPage(userlock, vesselId, accountType) {
        var canview = true;
        var vesselDisinfectionReportService = this.serviceManager.GetVesselDisinfectionService();
        if (accountType !== "vessel") {
            canview = await vesselDisinfectionReportService.CanViewVesselDisinfectionPage(vesselId, userlock);
        }
        if (canview) {
            return vesselDisinfectionReportService.LockVesselDisinfectionPage(vesselId)
        } else {
            throw new Error("Another device is accessing this page now")
        }
    }
    async GetVessel(vesselID) {
        var service = this.serviceManager.GetVesselDisinfectionService()
        return await service.GetVessel(vesselID);
    }
    async GetVesselDisinfectionRecord(user, vesselId) {
        if (!permissionController.canCreateLogForVessel(user, vesselId)) {
            throw new Error("User unauthorized")
        }
        var service = this.serviceManager.GetVesselDisinfectionService()
        return await service.GetVesselDisinfections(vesselId)
    }

    /*
    log : {
        vesselId : integer,
        dateSubmitted : datetime,
        timeSubmitted : string,
        filepath : string?,
        gallery : boolean,
        wheelhouse : boolean,
        messroom : boolean,
        toilets : boolean,
        doorknobs : boolean,
        staircase : boolean,
        silentroom : boolean,
        remarks : string,
        checkedBy : string,
        recordId : integer?
    }
    */
    async ValidateLog(user, log) {
        if (helper.IsEmpty(log.dateSubmitted)) {
            throw new Error("Date submitted cannot be empty")
        }
        if (!permissionController.canCreateLogForVessel(user,log.vesselId)) {
            throw new Error("User unauthorized")
        }
        return true
    }
    async PostDisinfectionLog(user, log) {
        await this.ValidateLog(user, log)
        return await this.serviceManager.GetVesselDisinfectionService().PostVesselDisinfection(log)
    }

    async SyncDisinfectionLogs(user, logs) {
        if (logs instanceof Array && logs.length > 0) {
            await Promise.all(logs.map(log => {
                return this.ValidateLog(user, log)
            }))
            return await Promise.all(logs.map(log => {
                return this.PostDisinfectionLog(user, log)
            }))
        } else {
            return []
        }
    }
    async ModifyData(report){
        report.date_submitted = moment(report.date_submitted).format('DD / MM / YYYY');
        report.date = moment(report.date).format('DD / MM / YYYY');
        return report;
    }
    async GenerateVesselDisinfectionForOldLogs() {
        var eligibleReports = await this.serviceManager.GetVesselDisinfectionService().ListVesselDisinfectionEligibleForPDF()
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
        info("Vessel disinfection report pdf generation starts");
        try{
            const reportDir = report.vessel_name+'\\vesselDisinfection'
            const relativeDir = uuid()
            const dirPath = path.join(config.kstConfig.filesLocation,reportDir,relativeDir)
            var content = fs.readFileSync(path.resolve('public','template', 'VesselDisinfectionTemplate.docx'), 'binary');
            var imageModule = new ImageModule(opts);
            var zip = new PizZip(content);
            info("Vessel disinfection report creating word file");
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
                    info("Vessel disinfection report converting word file into pdf");
                fs.writeFileSync(pdfPath, done);
                fs.unlink(docPath, () => {})
                if(err == null){
                    pdfPath = pdfPath.replace(config.kstConfig.fileLocationWithoutPublic, "");
                    pdfPath = pdfPath.replace(/\\/g,"/")
                    await this.serviceManager.GetVesselDisinfectionService().UpdateFilePath(report.record_id, pdfPath);
                    info("Vessel disinfection report file path stored into the database");
                    resolve({filePath : pdfPath});
                    // this.serviceManager.CreateFile({name : pdfname, relativeDir : relativeDir},10,() => {
                    //     queries -= 1
                    //     if (queries == 0) {callback({filePath : pdfPath},err)}
                    // })
                }
            })
            );
        }catch (e) {
            ErrorLog(`Vessel disinfection report pdf generation error block : ${e}`);
            // e.properties.errors.map(error => console.log("Errors detected in generating PDF", error));
        }
    }
}
module.exports = new VesselDisinfectionApi();