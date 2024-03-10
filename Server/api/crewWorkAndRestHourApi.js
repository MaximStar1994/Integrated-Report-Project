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

const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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

class CrewWorkAndRestApi {
    constructor () {
        this.serviceManager = new ServiceManager()
    }
    async CanViewCrewWorkAndRestHourPage(userlock, crewId) {
        var crewWorkAndRestHourService = this.serviceManager.GetCrewWorkAndRestHourService()
        return await crewWorkAndRestHourService.CanViewCrewWorkAndRestHourPage(crewId, userlock);
    }
    async LockCrewWorkAndRestHourPage(userlock, crewId) {
        var crewWorkAndRestHourService = this.serviceManager.GetCrewWorkAndRestHourService()
        let canview = await crewWorkAndRestHourService.CanViewCrewWorkAndRestHourPage(crewId, userlock)
        if (canview) {
            return crewWorkAndRestHourService.LockCrewWorkAndRestHourPage(crewId)
        } else {
            throw new Error("Another device is accessing this page now")
        }
    }
    async UnlockCrewWorkAndRestHourPage(userlock, crewId) {
        var crewWorkAndRestHourService = this.serviceManager.GetCrewWorkAndRestHourService()
        let canview = await crewWorkAndRestHourService.CanViewCrewWorkAndRestHourPage(crewId, userlock)
        if (canview) {
            return await crewWorkAndRestHourService.UnlockCrewWorkAndRestHourPage(crewId)
        } else {
            throw new Error("Another device is accessing this page now")
        }
    }
    async GetCrewWorkAndRestHourData(employeeNo, month, year) {
        var crewWorkAndRestHourService = this.serviceManager.GetCrewWorkAndRestHourService();
        let data = await crewWorkAndRestHourService.GetCrewWorkAndRestHourData(employeeNo, month, year);
        if(data!==null){
            return data;
        }
        else{
            throw new Error('Invalid Crew Id / Month / Year');
        }
    }
    async GetPreviousSubmission(employeeNo, month, year) {
        var crewWorkAndRestHourService = this.serviceManager.GetCrewWorkAndRestHourService();
        return await crewWorkAndRestHourService.GetPreviousSubmission(employeeNo, month, year);
    }
    async GetCrewList() {
        var crewWorkAndRestHourService = this.serviceManager.GetCrewWorkAndRestHourService();
        let data = await crewWorkAndRestHourService.ListCrew();
        return data;
    }
    async PostCrewWorkAndRestHourData(user, log){
        return await this.serviceManager.GetCrewWorkAndRestHourService().CreateCrewWorkAndRestHour(log);
    }
    async GenerateCrewWorkAndRestHourReportForOldLogs() {
        var eligibleReports = await this.serviceManager.GetCrewWorkAndRestHourService().ListCrewWorkAndRestReportEligibleForPDF()
        if(eligibleReports.length === 0){
            return null;
        }
        else {
            for (let report of eligibleReports){
                report.totalRestHours = report.crewWorkingData.totalRestHours;
                report.crewWorkingData = report.crewWorkingData.crewWorkingData;
                let tableData = report.crewWorkingData;
                for (const [key, value] of Object.entries(tableData)) {
                    for (const [key2, value2] of Object.entries(value)) {
                        if(key2!=='totalRestHours')
                            tableData[key][key2] = !value2;
                    }
                }
                await this.GeneratePDF(report);
            }
            return null;
        }
    }
    async ModifyData(report) {
        report.month = monthsList[report.month];
        report.dateSubmitted = moment(report.dateSubmitted).format('DD / MM / YYYY');
        report.folderName = `${report.month} ${report.year}`;
        return report;
    }
    async GeneratePDF(report) {
        info("CrewWorkAndRestHour report pdf generation starts");
        try{
            report = await this.ModifyData(report);
            const reportDir = 'crewWorkAndRestHour\\' + report.folderName
            const relativeDir = uuid()
            const dirPath = path.join(config.kstConfig.filesLocation,reportDir,relativeDir)
            var content = fs.readFileSync(path.resolve('public','template', 'CrewWorkAndRestHourTemplate.docx'), 'binary');
            var imageModule = new ImageModule(opts);
            var zip = new PizZip(content);
            info("CrewWorkAndRestHour report creating word file");
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
                info("CrewWorkAndRestHour report converting word file into pdf");
                fs.writeFileSync(pdfPath, done);
                fs.unlink(docPath, () => {})
                if(err == null){
                    pdfPath = pdfPath.replace(config.kstConfig.fileLocationWithoutPublic, "");
                    pdfPath = pdfPath.replace(/\\/g,"/")
                    await this.serviceManager.GetCrewWorkAndRestHourService().UpdateCrewWorkAndRestHourFilePath(report.formId, pdfPath);
                    info("CrewWorkAndRestHour report file path stored into the database");
                    resolve({filePath : pdfPath});
                    // this.serviceManager.CreateFile({name : pdfname, relativeDir : relativeDir},10,() => {
                    //     queries -= 1
                    //     if (queries == 0) {callback({filePath : pdfPath},err)}
                    // })
                }
            })
            );
        }catch (e) {
            ErrorLog(`CrewWorkAndRestHour report pdf generation error block : ${e}`);
            // e.properties.errors.map(error => console.log("Errors detected in generating PDF", error));
        }
    }
    
    async GetCrewWorkAndRestHourUpdate(month, year) {
        var crewWorkAndRestHourService = this.serviceManager.GetCrewWorkAndRestHourService();
        let data = await crewWorkAndRestHourService.GetCrewWorkAndRestHourUpdate(month, year);
        if(data!==null){
            return data;
        }
        else{
            throw new Error('Invalid Month / Year');
        }
    }
    async PostCrewWorkAndRestHourUpdateData(user, log){
        return await this.serviceManager.GetCrewWorkAndRestHourService().CreateCrewWorkAndRestHourUpdate(log);
    }
}

module.exports = new CrewWorkAndRestApi();