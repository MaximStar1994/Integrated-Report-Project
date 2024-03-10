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
const config = require("../config/config");
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

class VesselReportApi {
    constructor () {
        this.serviceManager = new ServiceManager()
    }
    async CanViewVesselReportPage(userlock, vesselId) {
        var vesselReportPageService = this.serviceManager.GetVesselReportService()
        return await vesselReportPageService.CanViewVesselReportPage(vesselId, userlock);
    }
    async GetVessel(vesselID) {
        var vesselReportPageService = this.serviceManager.GetVesselReportService()
        return await vesselReportPageService.GetVessel(vesselID);
    }
    async GetGeneratorStructure(vesselID) {
        var vesselReportPageService = this.serviceManager.GetVesselReportService()
        return await vesselReportPageService.GetGeneratorStructure(vesselID);
    }
    async GetCrewData(vesselID) {
        var vesselReportPageService = this.serviceManager.GetVesselReportService()
        return await vesselReportPageService.GetCrewData(vesselID);
    }
    async GetVesselName(vesselID) {
        var vesselReportPageService = this.serviceManager.GetVesselReportService()
        return await vesselReportPageService.GetVesselName(vesselID);
    }
    async GetMaineMDeckLog(vesselID, reportDate, shift){
        var vesselReportPageService = this.serviceManager.GetVesselReportService()
        return await vesselReportPageService.GetMarineMDeckLog(vesselID, reportDate, shift);
    }
    async UnlockVesselReportPage(userlock, vesselId) {
        var vesselReportPageService = this.serviceManager.GetVesselReportService()
        let canview = await vesselReportPageService.CanViewVesselReportPage(vesselId, userlock)
        if (canview) {
            return await vesselReportPageService.UnlockVesselReportPage(vesselId)
        } else {
            throw new Error("Another device is accessing this page now")
        }
    }
    async LockVesselReportPage(userlock, vesselId, accountType) {
        var canview = true;
        var vesselReportPageService = this.serviceManager.GetVesselReportService()
        if (accountType !== "vessel") {
            canview = await vesselReportPageService.CanViewVesselReportPage(vesselId, userlock)
        }
        if (canview) {
            return vesselReportPageService.LockVesselReportPage(vesselId)
        } else {
            throw new Error("Another device is accessing this page now")
        }
    }
    async GetVesselReport(reportId) {
        var vesselReportPageService = this.serviceManager.GetVesselReportService()
        return vesselReportPageService.GetVesselReport(reportId)
    }
    async ValidateVesselReport(vesselreport) {
        // if (helper.IsEmpty(vesselreport.vesselId)) {
        //     throw new Error("Missing Vessel Id")
        // }
        // let crew = await this.serviceManager.GetCrewService().ListCrew(vesselreport.vesselId)
        // let crewIds = crew.map(crewmember => parseInt(crewmember.crewId))
        if (!(vesselreport.crew instanceof Object && vesselreport.crew.resting && vesselreport.crew.resting instanceof Array && vesselreport.crew.working && vesselreport.crew.working instanceof Array)) {
            throw new Error("Invalid crew")
        }
        // let reportcrewIds = [];
        // vesselreport.crew.working.forEach(member => reportcrewIds.push(parseInt(member.crewId)));
        // vesselreport.crew.resting.forEach(member => reportcrewIds.push(parseInt(member.crewId)));
        // let validcrewIds = true;
        // reportcrewIds.forEach(id => {
        //     if (!crewIds.includes(id)) {
        //         validcrewIds = false
        //     }
        // })
        // if (!validcrewIds) {
        //     throw new Error("Invalid crew")
        // }
        // let validlog = true
        // if (vesselreport.decklogs instanceof Array) {
        //     vesselreport.decklogs.forEach(log => {
        //         if (log.endtime < log.starttime) {
        //             validlog = false
        //         }
        //     })
        // }
        // if (!validlog) {
        //     throw new Error("Invalid log")
        // }
        return true
    }
    async SyncVesselReport(user, report) {
        await this.ValidateVesselReport(report)
        if (!permissionController.canCreateLogForVessel(user, report.vesselId)) {
            throw new Error("Unauthorized")
        }
        var vesselReportPageService = this.serviceManager.GetVesselReportService()
        if (helper.IsEmpty(report.formId)) {
            return await vesselReportPageService.CreateVesselReport(report)
        } else {
            return report
        }
    }
    async SyncVesselReports(user, reports) {
        if (reports instanceof Array && reports.length > 0) {
            return await Promise.all(reports.map(report => {
                return this.SyncVesselReport(user, report)
            }))
        } else {
            return []
        }
    }
    async UpdateFilePathForVesselReport(reportId, filepath) {
        var vesselReportPageService = this.serviceManager.GetVesselReportService()
        return await vesselReportPageService.UpdateVesselReportFilePath(reportId, filepath)
    }
    async ListVesselReports(vesselId){
        var vesselReportPageService = this.serviceManager.GetVesselReportService()
        return await vesselReportPageService.ListVesselReports(vesselId)
    }
    async ListVesselReport(vesselId){
        var vesselReportPageService = this.serviceManager.GetVesselReportService()
        return await vesselReportPageService.ListVesselReport(vesselId)
    }
    async GetCrewWorkAndRestHour(forDate,vesselId) {
        let vessel = await this.serviceManager.GetVesselService().GetVessel(vesselId)
        let crew = await this.serviceManager.GetCrewService().ListCrew(vesselId)
        let crewWorkHourStatus = await Promise.all(crew.map((member) => {
            return new Promise(async (res,rej) => {
                let monthStart = moment(forDate).tz(vessel.timezone).startOf("month")
                let monthEnd = moment(forDate).tz(vessel.timezone).endOf("month")
                let rows = await this.serviceManager.GetVesselReportService().GetCrewVesselReports(monthStart, monthEnd, member.crewId)
                let month = {}
                while (monthStart.isSameOrBefore(monthEnd,"day")) {
                    var relatedRowMorning = rows.find((row) => {
                        return moment(row.formDate).tz(vessel.timezone).isSame(monthStart,"day") && row.shift == 1
                    })
                    var relatedRowNight = rows.find((row) => {
                        return moment(row.formDate).tz(vessel.timezone).isSame(monthStart,"day") && row.shift == 2
                    })
                    month[monthStart.format("DD-MM-YYYY")] = {
                        morningShift : relatedRowMorning ? relatedRowMorning.isWorking : 1,
                        nightShift : relatedRowNight ? relatedRowNight.isWorking : 2,
                    }
                    monthStart.add(1,"day")
                }
                res({
                    crewId : member.crewId,
                    crewName : member.name,
                    monthWorkingStatus : month
                })
            })
        }))
        return crewWorkHourStatus
    }
    async saveAuthorizedBackDatedData(authorizedBackDatedData, user) {
        try {
          var vesselReportPageService = this.serviceManager.GetVesselReportService();
          return await vesselReportPageService.saveAuthorizedBackDatedData( authorizedBackDatedData, user );
        } catch (error) {
          throw new Error(error.message);
        }
      }
    
      async fetchAuthorizedBackDatedData() {
        try {
          var vesselReportPageService = this.serviceManager.GetVesselReportService();
          return await vesselReportPageService.fetchAuthorizedBackDatedData();
        } catch (error) {
          throw new Error(error.message);
        }
      }
    
      async deleteAuthorizedBackDatedDataById(backDatedId) {
        try {
          var vesselReportPageService = this.serviceManager.GetVesselReportService();
          return await vesselReportPageService.deleteAuthorizedBackDatedDataById( backDatedId );
        } catch (error) {
          throw new Error(error.message);
        }
      }
    
      async checkAuthorizedBackDatedData(authorizedBackDatedData) {
        try {
          var vesselReportPageService = this.serviceManager.GetVesselReportService();
          return await vesselReportPageService.checkAuthorizedBackDatedData( authorizedBackDatedData );
        } catch (error) {
          throw new Error(error.message);
        }
      }
    
      async isAuthorizedBackDatedDataAvailable(vesselId) {
        try {
          var vesselReportPageService = this.serviceManager.GetVesselReportService();
          return await vesselReportPageService.isAuthorizedBackDatedDataAvailable( vesselId );
        } catch (error) {
          throw new Error(error.message);
        }
      }
    
      async isAuthorizedBackDatedDataComplete(queryParam) {
        try {
          var vesselReportPageService = this.serviceManager.GetVesselReportService();
          return await vesselReportPageService.isAuthorizedBackDatedDataComplete( queryParam );
        } catch (error) {
          throw new Error(error.message);
        }
      }
    async ModifyData(report) {
        console.log(report);
        delete report.decklogs;
        let decklog = await this.GetMaineMDeckLog(report.vesselId, report.reportDate, report.shift);
        report.decklogs = decklog;
        if(report.shift===1)
            report.shiftTitle = 'Morning Shift Log [0730 - 1930]';
        else if(report.shift===2)
            report.shiftTitle = 'Evening Shift Log [1930 - 0730]';
        report.formDate = moment(report.formDate).format('DD-MM-YYYY');

        report.workingCrew = report.crew.filter(crewData => crewData.isWorking==='1');
        report.restingCrew = report.crew.filter(crewData => crewData.isWorking==='2');

        // report.decklogs.forEach(decklog => {
        //     if(decklog.starttime!==undefined && decklog.starttime!==null && decklog.starttime!==''){
        //         decklog.starttime = moment(decklog.starttime).format('DD / MM / YYYY HH:mm');
        //     }
        // })
        // report.decklogs.forEach(decklog => {
        //     if(decklog.endtime!==undefined && decklog.endtime!==null && decklog.endtime!==''){
        //         decklog.endtime = moment(decklog.endtime).format('DD / MM / YYYY HH:mm');
        //     }
        // })
        report.engines.forEach(engine=> {
            engine[engine.engineIdentifier] = true;
            if(report.vesselId===10||report.vesselId===11){
                engine.LNGProperties = true;
            }
        })
        report.generators.forEach(generator=> {
            generator[generator.generatorIdentifier] = true;
        })
        report.zpClutch.forEach(zpclutch=> {
            zpclutch[zpclutch.identifier] = true;
        })
        let vesselName = await this.GetVesselName(report.vesselId);
        report.vesselName = vesselName;
        return report;
    }
    async GenerateVesselReportForOldLogs() {
        var eligibleReports = await this.serviceManager.GetVesselReportService().ListVesselReportEligibleForPDF()
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
        info("Vessel report pdf generation starts");
        try{
            const reportDir = report.vesselName + '\\vesselReport'
            const relativeDir = uuid()
            const dirPath = path.join(config.kstConfig.filesLocation,reportDir,relativeDir)
            var content = fs.readFileSync(path.resolve('public','template', 'VesselReportTemplate.docx'), 'binary');
            var imageModule = new ImageModule(opts);
            var zip = new PizZip(content);
            info("Vessel report creating word file");

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
                libre.convert(buf,".pdf",undefined, async (err, done) => {
                info("Vessel report converting word file into pdf");
                fs.writeFileSync(pdfPath, done);
                fs.unlink(docPath, () => {})
                if(err == null){
                    pdfPath = pdfPath.replace(config.kstConfig.fileLocationWithoutPublic, "");
                    pdfPath = pdfPath.replace(/\\/g,"/")
                    await this.serviceManager.GetVesselReportService().UpdateVesselReportFilePath(report.formId, pdfPath);
                    info("Vessel report file path stored into the database");
                    resolve({filePath : pdfPath});
                    // this.serviceManager.CreateFile({name : pdfname, relativeDir : relativeDir},10,() => {
                    //     queries -= 1
                    //     if (queries == 0) {callback({filePath : pdfPath},err)}
                    // })
                }
            })
            );
        }catch (e) {
            ErrorLog(`Vessel report pdf generation error block : ${e}`);
            // e.properties.errors.map(error => console.log("Errors detected in generating PDF", error));
        }
    }

    async fetchShiftBackDatedDataByReportDate(vesselId, reportDate) {
        try {
          var vesselReportPageService = this.serviceManager.GetVesselReportService();
          return await vesselReportPageService.fetchShiftBackDatedDataByReportDate(vesselId, reportDate);
        } catch (error) {
          throw new Error(error.message);
        }
    }

    async getVesselReportFormStructure(vesselId,dailyLogApi) {
        try {
          var vesselReportPageService = this.serviceManager.GetVesselReportService();
          return await vesselReportPageService.getVesselReportFormStructure(vesselId,dailyLogApi);
        } catch (error) {
          throw new Error(error.message);
        }
    }

    async getVesselReportShiftLogFormStructure(vesselId,SHIFT) {
        try {
          var vesselReportPageService = this.serviceManager.GetVesselReportService();
          return await vesselReportPageService.getVesselReportShiftLogFormStructure(vesselId,SHIFT);
        } catch (error) {
          throw new Error(error.message);
        }
    }

    async getPreviousDateMissingSubmissionVRFDLData(reportDate) {
        try {
            var vesselReportPageService = this.serviceManager.GetVesselReportService();
            return await vesselReportPageService.getPreviousDateMissingSubmissionVRFDLData(reportDate);
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
}
module.exports = new VesselReportApi();