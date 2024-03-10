const ServiceManager = require('../services/ServiceManager.js')
const { uuid } = require('uuidv4');
const path = require('path');
const fs = require('fs');
const PizZip = require('pizzip');
const Docxtemplater = require("docxtemplater");
const ImageModule = require('open-docxtemplater-image-module');
const libre = require('libreoffice-convert');
var moment = require('moment');
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
"use strict";
class BunkerDeliveryApi {
    constructor () {
        this.serviceManager = new ServiceManager()
    }
    CanViewBDNPage(userlock, callback) {
        var bdnService = this.serviceManager.GetBunkerDeliveryApi()
        bdnService.CanViewBDNPage(userlock,(canView,err) => {
            if (!canView) {
                err = "Another device is accessing this page now"
                callback(null, err)
            } else {
                bdnService.LockBDNPage(callback)
            }
        })
    }
    UnlockBDNPage(userLock, callback) {
        var bdnService = this.serviceManager.GetBunkerDeliveryApi()
        bdnService.CanViewBDNPage(userLock,(canView,err) => {
            if (!canView) {
                err = "Another device is accessing this page now"
                callback(null, err)
            } else {
                bdnService.UnlockBDNPage(callback)
            }
        })
    }
    GenerateBunkerDeliveryReport(bunkerReportId, prelimData, callback) {
        var parsed = {}
        this.GetBunkerDeliveryNote(bunkerReportId, (data) => {
            var arrivalDate = moment(data.vesselArrivalDate)
            data.vesselArrivedDated = arrivalDate.format("DD-MMM-YY")
            data.vesselArrivedTime = arrivalDate.format("HH:mm")
            data.dateOfBDN = moment(data.generatedDate).format("DD-MMM-YY")
            var allfastDate = moment(data.vesselAllfastDate)
            data.vesselAllfastDated = allfastDate.format("DD-MMM-YY")
            data.vesselAllfastTime = allfastDate.format("HH:mm")
            var hoseConnectedDate = moment(data.hoseConnectedDate)
            data.hoseConnectedDated = hoseConnectedDate.format("DD-MMM-YY")
            data.hoseConnectedTime = hoseConnectedDate.format("HH:mm")
            var openMeasurementDatetime = moment(data.openMeasurementCompletedDate)
            data.openMeasurementCompletedDated = openMeasurementDatetime.format("DD-MMM-YY")
            data.openMeasurementCompletedTime = openMeasurementDatetime.format("HH:mm")
            var startTransferDate = moment(data.startTransferDate)
            data.startTransferDated = startTransferDate.format("DD-MMM-YY")
            data.startTransferTime = startTransferDate.format("HH:mm")
            var completeTransferDate = moment(data.completeTransferDate)
            data.completeTranferDated = completeTransferDate.format("DD-MMM-YY")
            data.completeTranferTime = completeTransferDate.format("HH:mm")
            var hoseDrainedDate = moment(data.hoseDrainedDate)
            data.hoseDrainedDated = hoseDrainedDate.format("DD-MMM-YY")
            data.hoseDrainedTime = hoseDrainedDate.format("HH:mm")
            var hoseDisconnectedDate = moment(data.hoseDisconnectedDate)
            data.hoseDisconnectedDated = hoseDisconnectedDate.format("DD-MMM-YY")
            data.hoseDisconnectedTime = hoseDisconnectedDate.format("HH:mm")
            var closeMeasurementCompletedDate = moment(data.closeMeasurementCompletedDate)
            data.closeMeasurementCompletedDated = closeMeasurementCompletedDate.format("DD-MMM-YY")
            data.closeMeasurementCompletedTime = closeMeasurementCompletedDate.format("HH:mm")
            var paperWorkCompletedDate = moment(data.paperWorkCompletedDate)
            data.paperworkCompletedDated = paperWorkCompletedDate.format("DD-MMM-YY")
            data.paperworkCompletedTime = paperWorkCompletedDate.format("HH:mm")
            data.reportId = bunkerReportId
            parsed = Object.assign(prelimData, data);

            parsed.grossHeatingValueMass = parsed.grossHeatingValueMass != null ? parsed.grossHeatingValueMass.toFixed(2) : '-'
            parsed.netHeatingValueMass = parsed.netHeatingValueMass != null ? parsed.netHeatingValueMass.toFixed(2) : '-'
            parsed.grossHeatingValueVol = parsed.grossHeatingValueVol != null ? parsed.grossHeatingValueVol.toFixed(2) : '-'
            parsed.netHeatingValueVol = parsed.netHeatingValueVol != null ? parsed.netHeatingValueVol.toFixed(2) : '-'
            parsed.mass = parsed.mass != null ? parsed.mass.toFixed(2) : '-'
            parsed.grossEnergy = parsed.grossEnergy != null ? parsed.grossEnergy.toFixed(2) : '-'
            parsed.vaporDisplaced = parsed.vaporDisplaced != null ? parsed.vaporDisplaced.toFixed(2) : '-'
            parsed.gasConsumed = parsed.gasConsumed != null ? parsed.gasConsumed.toFixed(2) : '-'

            this.GenerateBunkerDeliveryReportFromData(parsed,callback)
        })
    }
    GenerateBunkerDeliveryReportFromData(data, callback) {
        info("GenerateBunkerDeliveryReportFromData pdf generation starts");
        const reportDir = 'bunkerdelivery'
        const relativeDir = uuid()
        const dirPath = path.join(config.kstConfig.filesLocation,reportDir,relativeDir)
        var content = fs.readFileSync(path.resolve('public','template', 'bunkerDelivery.docx'), 'binary');
        var zip = new PizZip(content);
        var imageModule = new ImageModule(opts);
        info("GenerateBunkerDeliveryReportFromData creating word file");
        var doc = new Docxtemplater(zip,{modules : [imageModule]})
        doc.setData(data);
        doc.render()
        var buf = doc.getZip().generate({type: 'nodebuffer'});
        fs.mkdirSync(dirPath, { recursive: true });
        var filename = uuid()
        var pdfname = `BunkerDelivery${data.reportId}` + ".pdf"
        var docname = filename + ".docx"
        var docPath = path.join(dirPath,docname)
        var pdfPath = path.join(dirPath,pdfname)
        fs.writeFileSync(docPath, buf)
        libre.convert(buf, ".pdf", undefined, (err, done) => {
            info("GenerateBunkerDeliveryReportFromData converting word file into pdf");
            fs.writeFileSync(pdfPath, done);
            fs.unlink(docPath, () => {})
            if(err == null){
                pdfPath = pdfPath.replace(config.kstConfig.fileLocationWithoutPublic, "");
                pdfPath = pdfPath.replace(/\\/g,"/")
                var queries = 2
                this.serviceManager.GetBunkerDeliveryApi().RecordBunkerDeliveryNote(data.reportId, pdfPath, (res,err) => {
                    queries -= 1
                    if (queries == 0) {callback({filePath : pdfPath},err)}
                })
                info("GenerateBunkerDeliveryReportFromData file path stored into the database");
                this.serviceManager.GetDocumentApi().CreateFile({name : pdfname, relativeDir : relativeDir},1,() => {
                    queries -= 1
                    if (queries == 0) {callback({filePath : pdfPath},err)}
                })
            }
        })
    }
    GetBunkerDeliveryReportData(reportId, callback) {
        var rtnSet = {}
        this.serviceManager.GetBunkerDeliveryApi().GetBunkerDeliveryNote(reportId, (report,err) => {
            // rtnSet = Object.assign(rtnSet, report);
            this.serviceManager.GetBunkerDeliveryApi().GetBDNTags((data,err) => {
                data.autoFillTime = new Date()
                rtnSet = Object.assign(rtnSet, data);
                callback(rtnSet, err)
                // this.ParseBunkerDeliveryReportData(rtnSet,err, callback)
            })
        })
    }
    GetBunkerDeliveryNote(reportId, callback) {
        this.serviceManager.GetBunkerDeliveryApi().GetBunkerDeliveryNote(reportId, callback)
    }
    GetOpenBunkerDeliveryNote(callback) {
        this.serviceManager.GetBunkerDeliveryApi().GetOpenBunkerDeliveryReport(callback)
    }
    ParseBunkerDeliveryReportData(data, err, callback) {
        if (data != null) {
            var data = this.serviceManager.GetBunkerDeliveryApi().Calculate(data)
            data.autoFillTime = new Date()
            this.serviceManager.GetBunkerDeliveryApi().UpdateBunkerDeliveryNote(data,() => {
                callback(data,err)
            })
        }
    }
    ListBunkerDeliveryReports(callback) {
        this.serviceManager.GetBunkerDeliveryApi().ListBunkerDeliveryNote(callback)
    }
    HasOpenBunkerDeliveryReport(callback) {
        this.serviceManager.GetBunkerDeliveryApi().HasOpenBunkerDeliveryReport((data,err) => {
            callback(data,err)
        })
    }
    CreateBunkerDeliveryReport(callback) {
        var bunkerDeliveryService = this.serviceManager.GetBunkerDeliveryApi()
        bunkerDeliveryService.HasOpenBunkerDeliveryReport((bdnIdOpen) => {
            if (bdnIdOpen != null) {
                callback({reportId : bdnIdOpen},null)
            } else {
                bunkerDeliveryService.CreateBunkerDeliveryNote((data,err) => {
                    callback(data,err)
                })
            }
        })
    }
    CreateBunkerDeliveryNoteFromData(data, callback) {
        var bunkerDeliveryService = this.serviceManager.GetBunkerDeliveryApi()
        bunkerDeliveryService.CreateBunkerDeliveryNoteFromData(data, (data,err) => {
            callback(data,err)
        })
    }
    UpdateBunkerDeliveryReport(data,callback) {
        this.serviceManager.GetBunkerDeliveryApi().UpdateBunkerDeliveryNote(data,(val,err) => {
            callback(val,err)
        })
    }
    GetCombustionTemperatures(callback) {
        this.serviceManager.GetBunkerDeliveryApi().GetCombustionTemperature((val,err) => {
            callback(val,err)
        })
    }
}
module.exports = BunkerDeliveryApi;
