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
const {info,err : ErrorLog} = require("../common/log")


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

class CrewTemperatureReportApi {
    constructor () {
        this.serviceManager = new ServiceManager()
    }
    async CheckSubmissionForToday(vesselId) {
        var crewTemperatureReportService = this.serviceManager.GetTemperatureLogService()
        return await crewTemperatureReportService.CheckSubmissionForToday(vesselId);
    }
    async CanViewCrewTemperatureReportPage(userlock, vesselId) {
        var crewTemperatureReportService = this.serviceManager.GetTemperatureLogService()
        return await crewTemperatureReportService.CanViewCrewTemperatureRecordPage(vesselId, userlock);
    }
    async GetVesselData(vesselID) {
        var crewTemperatureReportService = this.serviceManager.GetTemperatureLogService()
        return await crewTemperatureReportService.GetVesselInfo(vesselID);
    }
    async UnlockCrewTemperatureReportPage(userlock, vesselId) {
        var crewTemperatureReportService = this.serviceManager.GetTemperatureLogService()
        let canview = await crewTemperatureReportService.CanViewCrewTemperatureRecordPage(vesselId, userlock)
        if (canview) {
            return await crewTemperatureReportService.UnlockCrewTemperatureRecordPage(vesselId)
        } else {
            throw new Error("Another device is accessing this page now")
        }
    }
    async LockTemperatureReportPage(userlock, vesselId, accountType) {
        var canview = true;
        var crewTemperatureReportService = this.serviceManager.GetTemperatureLogService();
        if (accountType !== "vessel") {
            canview = await crewTemperatureReportService.CanViewCrewTemperatureRecordPage(vesselId, userlock);
        }
        if (canview) {
            return crewTemperatureReportService.LockCrewTemperatureRecordPage(vesselId)
        } else {
            throw new Error("Another device is accessing this page now")
        }
    }
    async GetTemperatureReport(recordId) {
        var crewTemperatureReportService = this.serviceManager.GetTemperatureLogService()
        return crewTemperatureReportService.GetTemperatureReport(recordId)
    }
    async ValidateTemperatureReport(temperatureReport) {
        if (helper.IsEmpty(temperatureReport.vesselId)) {
            throw new Error("Missing Vessel Id")
        }
        temperatureReport.crew.forEach(report => {
            if(!helper.IsEmpty(report.name)){
                if(helper.IsEmpty(report.temp1)){
                    throw new Error(`Missing Temperature 1 of ${report.name}`);
                } 
                if(helper.IsEmpty(report.temp2)){
                    throw new Error(`Missing Temperature 2 of ${report.name}`);
                }
            }
        })
        return true
    }
    async SyncTemperatureReport(user, report) {
        await this.ValidateTemperatureReport(report)
        if (!permissionController.canCreateLogForVessel(user, report.vesselId)) {
            throw new Error("Unauthorized")
        }
        var crewTemperatureReportService = this.serviceManager.GetTemperatureLogService()
        if (helper.IsEmpty(report.recordId)) {
            return await crewTemperatureReportService.CreateCrewTemperatureRecord(report)
        } else {
            return report
        }
    }
    async SyncTemperatureReports(user, reports) {
        if (reports instanceof Array && reports.length > 0) {
            return await Promise.all(reports.map(report => {
                return this.SyncTemperatureReport(user, report)
            }))
        } else {
            return []
        }
    }
    async UpdateFilePathForTemperatureReport(recordId, filepath) {
        var crewTemperatureReportService = this.serviceManager.GetTemperatureLogService()
        return await crewTemperatureReportService.UpdateFilePath(recordId, filepath)
    }
    async ListTemperatureReports(vesselId){
        var crewTemperatureReportService = this.serviceManager.GetTemperatureLogService()
        return await crewTemperatureReportService.ListTemperatureReports(vesselId)
    }
    async ModifyData(report) {
        report.dateSubmitted = moment(report.dateSubmitted).format('DD / MM / YYYY');
        report.crew.forEach((element, idx) => {
            if(!helper.IsEmpty(element['firstARISymptoms']))
                element['firstARISymptoms'] = moment(element['firstARISymptoms']).format('DD / MM / YYYY');
            else
                element['firstARISymptoms'] = "";
            
            if(!helper.IsEmpty(element['testDate']))
                element['testDate'] = moment(element['testDate']).format('DD / MM / YYYY');
            else
                element['testDate'] = "";
            
            if(!helper.IsEmpty(element.name))
                element[idx] = true;

            if(element['symptomsInLast14Days'] === true)
                element['symptomsInLast14Days'] = 'Yes'
            else if(element['symptomsInLast14Days'] === false)
                element['symptomsInLast14Days'] = 'No'
            else
                element['symptomsInLast14Days'] = ''

            if(element['contactWithSuspected'] === true)
                element['contactWithSuspected'] = 'Yes'
            else if(element['contactWithSuspected'] === false)
                element['contactWithSuspected'] = 'No'
            else
                element['contactWithSuspected'] = ''

            if(element['pcr'] === true)
                element['pcr'] = 'Positive'
            else if(element['pcr'] === false)
                element['pcr'] = 'Negative'
            else
                element['pcr'] = 'Not Taken'

            if(element['art'] === true)
                element['art'] = 'Positive'
            else if(element['art'] === false)
                element['art'] = 'Negative'
            else
                element['art'] = 'Not Taken'
                
            if(element['symptomsInLast14Days']==='No'){
                element['symptoms'] = 'NA';
                element['firstARISymptoms'] = 'NA';
                element['contactWithSuspected'] = 'NA';
                element['testDate'] = 'NA';
                element['pcr'] = 'NA';
                element['art'] = 'NA';
            }
        })
        return report;
    }
    async GenerateTemperatureReportsForOldLogs() {
        var eligibleReports = await this.serviceManager.GetTemperatureLogService().ListCrewTemperatureRecordsEligibleForPDF()
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
        info("Crew temperature report pdf generation starts");
        try{
            const reportDir = report.vesselName+'\\CrewTemperatureReports'
            const relativeDir = uuid()
            const dirPath = path.join(config.kstConfig.filesLocation,reportDir,relativeDir)
            var content = fs.readFileSync(path.resolve('public','template', 'CrewTemperatureReportTemplate.docx'), 'binary');
            var imageModule = new ImageModule(opts);
            var zip = new PizZip(content);
            info("Crew temperature report creating word file");
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
                info("Crew temperature report converting word file into pdf");
                fs.writeFileSync(pdfPath, done);
                fs.unlink(docPath, () => {})
                if(err == null){
                    pdfPath = pdfPath.replace(config.kstConfig.fileLocationWithoutPublic, "");
                    pdfPath = pdfPath.replace(/\\/g, "/");
                    await this.serviceManager.GetTemperatureLogService().UpdateFilePath(report.recordId, pdfPath);
                    info("Crew temperature report file path stored into the database");
                    resolve({filePath : pdfPath});
                    // this.serviceManager.CreateFile({name : pdfname, relativeDir : relativeDir},10,() => {
                    //     queries -= 1
                    //     if (queries == 0) {callback({filePath : pdfPath},err)}
                    // })
                }
            })
            );
        } catch (e) {
            ErrorLog(`Crew temperature report pdf generation error block : ${e}`);
            // e.properties.errors.map(error => console.log("Errors detected in generating PDF", error));
        }
    }
}
module.exports = new CrewTemperatureReportApi();