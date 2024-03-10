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

class TemperatureTrackingApi {
    constructor () {
        this.serviceManager = new ServiceManager()
    }
    async GetCrewTemperature(user, year,week,vesselId) {
        if (!permissionController.canCreateLogForVessel(user,vesselId)){
            throw new Error("Unauthroized")
        }
        var service = this.serviceManager.GetTemperatureLogService()
        return await service.GetTemperatureLogs(year,week,vesselId)
    }
    /*
    log : {
        dateSubmitted : datetime,
        crewId : integer,
        temperature : decimal, 
        daySlot : integer,
    }
    */
    async ValidateLog(user, log) {
        if (helper.IsEmpty(log.dateSubmitted)) {
            throw new Error("Date submitted cannot be empty")
        }
        if (helper.IsEmpty(log.crewId)) {
            throw new Error("Crew must be selected")
        }
        if (helper.IsEmpty(log.temperature)) {
            throw new Error("Temperature submitted cannot be empty")
        }
        if (helper.IsEmpty(log.daySlot)) {
            throw new Error("Day Slot must be selected")
        }
        let authorized = await permissionController.canManageCrew(user,log.crewId)
        if (!authorized) {
            throw new Error("User unauthorized")
        }
        return true
    }
    async PostTemperatureLog(user, log) {
        await this.ValidateLog(user, log)
        return await this.serviceManager.GetTemperatureLogService().PostTemperatureLog(log)
    }

    async SyncTemperatureLogs(user, temperaturelogs) {
        await Promise.all(temperaturelogs.map(log => {
            return this.ValidateLog(user, log)
        }))
        if (temperaturelogs instanceof Array && temperaturelogs.length > 0) {
            return await Promise.all(temperaturelogs.map(log => {
                return this.PostTemperatureLog(user, log)
            }))
        } else {
            return []
        }
    }
    async UpdateFilePathForLogs(logIds, filepath) {
        var service = this.serviceManager.GetTemperatureLogService()
        return await Promise.all(logIds.map(id => {
            return service.UpdateTemperatureLogFilePath(id, filepath)
        }))
    }
}
module.exports = new TemperatureTrackingApi();