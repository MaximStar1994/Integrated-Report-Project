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
const permissionController = require('./permissionController');

class AnalyticsApi {
    constructor () {
        this.serviceManager = new ServiceManager()
    }
    
    async GetTagTrend(vesselID,startDT, endDT,tagnames,tagIdentifier){
        var analyticsService = this.serviceManager.GetAnalyticsService()
        return await analyticsService.GetDataForTrend(vesselID,startDT, endDT,tagnames,tagIdentifier);
    }

     async GetAllTags(vesselID) {
        var analyticsService = this.serviceManager.GetAnalyticsService()
        return await analyticsService.GetAllTags(vesselID)
     }

}
module.exports = new AnalyticsApi();