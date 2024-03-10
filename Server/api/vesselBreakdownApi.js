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

class VesselBreakdownApi {
    constructor () {
        this.serviceManager = new ServiceManager()
    }
    async GetUserNameFromAccountId(accountId){
        var vesselBreakdownPageService = this.serviceManager.GetVesselBreakdownService()
        return await vesselBreakdownPageService.GetUserNameFromAccountId(accountId);
    }
    async CanViewVesselBreakdownPage(userlock, vesselId) {
        var vesselBreakdownPageService = this.serviceManager.GetVesselBreakdownService()
        return await vesselBreakdownPageService.CanViewVesselBreakdownPage(userlock, vesselId);
    }
    async UnlockVesselBreakdownPage(userlock, vesselId) {
        var vesselBreakdownPageService = this.serviceManager.GetVesselBreakdownService()
        let canview = await vesselBreakdownPageService.CanViewVesselBreakdownPage(userlock, vesselId)
        if (canview) {
            return await vesselBreakdownPageService.UnlockVesselBreakdownPage(vesselId)
        } else {
            let currentUser = await this.GetCurrentUser(vesselId);
            throw new Error(`${currentUser} is accessing this page now`)
        }
    }
    async GetCurrentUser(vesselId) {
        var vesselBreakdownPageService = this.serviceManager.GetVesselBreakdownService();
        return await vesselBreakdownPageService.GetCurrentUser(vesselId);
    }
    async LockVesselBreakdownPage(userlock, vesselId, user) {
        var vesselBreakdownPageService = this.serviceManager.GetVesselBreakdownService()
        let canview = await vesselBreakdownPageService.CanViewVesselBreakdownPage(userlock, vesselId)
        if (canview) {
            return vesselBreakdownPageService.LockVesselBreakdownPage(vesselId, user)
        } else {
            throw new Error("Another device is accessing this page now")
        }
    }
    async GetBreakDownEventsForVessel(user, vesselId, isManagement) {
        var service = this.serviceManager.GetVesselBreakdownService()
        return await service.GetBreakDownEventsForVessel(vesselId,isManagement)
    }

    /*
    event : {
        vesselId : integer,
        breakdownDatetime : datetime, 
        reason : string, 
        eventId : int?, 
    }
    */
    async ValidateEvent(user, event) {
        // if (helper.IsEmpty(event.breakdownDatetime)) {
        //     throw new Error("Breakdown datetime cannot be empty")
        // }
        // if (helper.IsEmpty(event.reason)) {
        //     throw new Error("Breakdown reason cannot be empty")
        // }
        // if (helper.IsEmpty(event.vesselId) || !permissionController.canCreateLogForVessel(user,event.vesselId)) {
        //     throw new Error("User unauthorized")
        // }
        return true
    }
    /*
    support : {
        eventId : integer,
        superintendent : string, 
        category : string, 
        remarks : { col : "remarks", type: "string" }, 
        vesselReplacement : { col : "vessel_replacement", type: "string" }, 
        vesselCondition : { col : "vessel_condition", type: "string" }, 
        updateDate : {col : "update_date", type : "datetime"},
        recordId : { col : "record_id", type: "identity" }, 
    }
    */
    async ValidateEventSupport(user, event, support) {
        // if (event == null) {
        //     throw new Error("Invalid event")
        // }
        // if (helper.IsEmpty(support.superintendent)) {
        //     throw new Error("Superintendent in charge cannot be empty")
        // }
        // if (helper.IsEmpty(support.category)) {
        //     throw new Error("Category cannot be empty")
        // }
        // if (helper.IsEmpty(support.remarks)) {
        //     throw new Error("Remarks cannot be empty")
        // }
        // if (helper.IsEmpty(support.vesselReplacement)) {
        //     throw new Error("Vessel Replacement cannot be empty")
        // }
        // if (helper.IsEmpty(support.vesselCondition)) {
        //     throw new Error("Vessel Condition cannot be empty")
        // }
        // if (helper.IsEmpty(event.vesselId) || !permissionController.canCreateLogForVessel(user,event.vesselId) || !permissionController.isAdmin(user)) {
        //     throw new Error("User unauthorized")
        // }
        return true
    }
    async PostBreakdownEvent(user, event, isEditableEvent) {
        await this.ValidateEvent(user, event);
        if (isEditableEvent) {
            const isRedundant = true;
            const isEditable = false;
            const status = "closed"
            //Here updating Current Event ID to is_redundant = true to notify it as a old data and saving current EVENT data as a new data
            await this.serviceManager.GetVesselBreakdownService().isRedundantBreakdownEvent(event.eventId, isRedundant, isEditable, status);
            delete event.eventId;
            event.is_editable = false;
        }
        if (helper.IsEmpty(event.eventId)) {
            return await this.serviceManager.GetVesselBreakdownService().CreateBreakdownEvent(event)
        } else {
            return await this.serviceManager.GetVesselBreakdownService().UpdateBreakdownEvent(event)
        }
    }
    async PostBreakdownEventSupport(user, support, isEditableEvent) {
        if (isEditableEvent) {
            delete support.recordId;
        }
        let event = await this.serviceManager.GetVesselBreakdownService().GetEvent(support.eventId)
        await this.ValidateEventSupport(user, event, support)
        if (helper.IsEmpty(support.recordId)) {
            return await this.serviceManager.GetVesselBreakdownService().CreateBreakDownSupport(support)
        } else {
            return await this.serviceManager.GetVesselBreakdownService().UpdateBreakDownSupport(support)
        }
    }
    async deleteVesselBreakdown(eventId) {
        try {
            var vesselBreakdownPageService = this.serviceManager.GetVesselBreakdownService()
            return await vesselBreakdownPageService.deleteVesselBreakdown(eventId);  
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async vesselDowntimeStatusChange(eventId,status,isEditable) {
        try {
            var vesselBreakdownPageService = this.serviceManager.GetVesselBreakdownService()
            return await vesselBreakdownPageService.vesselDowntimeStatusChange(eventId,status,isEditable);  
        } catch (error) {
            throw new Error(error.message);
        }
    }
    ModifyData = data => {
        data['breakdown_date'] = moment(data['breakdown_datetime']).format('DD / MM / yyyy');
        data['breakdown_time'] = moment(data['breakdown_datetime']).format('HH:mm');
        data['back_to_operation_date'] = moment(data['back_to_operation_datetime']).format('DD / MM / yyyy');
        data['back_to_operation_time'] = moment(data['back_to_operation_datetime']).format('HH:mm');

        return data;
    }
    async GenerateVesselBreakdownForOldLogs() {
        var eligibleReports = await this.serviceManager.GetVesselBreakdownService().ListVesselBreakdownEligibleForPDF()
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
        info("Vessel breakdown report pdf generation starts");
        try{
            const reportDir = report.vessel_name+'\\vesselDowntime'
            const relativeDir = uuid()
            const dirPath = path.join(config.kstConfig.filesLocation,reportDir,relativeDir)
            var content = fs.readFileSync(path.resolve('public','template', 'VesselBreakdownTemplate.docx'), 'binary');
            var imageModule = new ImageModule(opts);
            var zip = new PizZip(content);
            info("Vessel breakdown report creating word file");
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
                    info("Vessel breakdown report converting word file into pdf");
                fs.writeFileSync(pdfPath, done);
                fs.unlink(docPath, () => {})
                if(err == null){
                    pdfPath = pdfPath.replace(config.kstConfig.fileLocationWithoutPublic, "");
                    pdfPath = pdfPath.replace(/\\/g,"/")
                    await this.serviceManager.GetVesselBreakdownService().UpdateFilePath(report.event_id, pdfPath);
                    info("Vessel breakdown report file path stored into the database");
                    resolve({filePath : pdfPath});
                }
            })
            );
        }catch (e) {
            ErrorLog(`Vessel breakdown report pdf generation error block : ${e}`);
        }
    }
}
module.exports = new VesselBreakdownApi();