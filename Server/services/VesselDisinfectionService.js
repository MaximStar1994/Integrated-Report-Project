const config = require('../config/config');
const helper = require('../helper/helperWithoutApi');
const {interfaceObj} = require("./interfaces/PostGreSQLInterface");
const moment = require('moment');
const { uuid } = require('uuidv4');
const pagekey = "VESSELDISINFECTION";

const VESSELDISINFECTIONMAP = {
    vesselId : { col : "vessel_id", type: "integer" },
    vesselName : { col : "vessel_name", type: "integer" },
    dateSubmitted : { col : "date_submitted", type: "datetime" }, 
    date : { col : "date", type: "string" }, 
    time : { col : "time", type: "string" }, 
    filepath : { col : "file_path", type: "string" }, 
    gallery : { col : "gallery", type: "bool" }, 
    wheelhouse : { col : "wheelhouse", type: "bool" }, 
    messroom : { col : "messroom", type: "bool" }, 
    toilets : { col : "toilets", type: "bool" }, 
    doorknobs : { col : "doorknobs", type: "bool" }, 
    staircase : { col : "staircase", type: "bool" }, 
    silentroom : { col : "silentroom", type: "bool" }, 
    remarks : { col : "remarks", type: "string" }, 
    checkedBy : {col : "checked_by", type : "string"},
    recordId : { col : "record_id", type: "identity" }, 
}


class VesselDisinfectionService {
    constructor () {
        this.sqlInterface = interfaceObj
    }
    async CheckSubmissionForToday(vesselId) {
        let todaySubmission = await this.sqlInterface.PerformQueryPromise(`
            SELECT *
            FROM ${config.kstConfig.sqlTables.VESSELDISINFECTION}
            WHERE vessel_id=$1 AND CAST(date_submitted AS DATE)=CAST(CURRENT_TIMESTAMP AS DATE)
        `,[vesselId])
        if (todaySubmission instanceof Array && todaySubmission.length > 0) {
            return true
        } else {
            return false
        }
    }
    async GetVessel(vesselId) {
        var vesselName = await this.sqlInterface.PerformQueryPromise(`
            SELECT vessel_id as id, name
            FROM ${config.kstConfig.sqlTables.VESSEL}
            WHERE vessel_id=$1
        `,[vesselId])
        return vesselName[0];
    }
    async GetVesselDisinfections(vesselId) {
        let where = {}
        where[VESSELDISINFECTIONMAP.vesselId.col] = vesselId
        return await this.sqlInterface.GetDataFromTable(
            config.kstConfig.sqlTables.VESSELDISINFECTION,VESSELDISINFECTIONMAP,
            where,
            `${VESSELDISINFECTIONMAP.dateSubmitted.col},${VESSELDISINFECTIONMAP.timeSubmitted.col} DESC`)
    }
    async PostVesselDisinfection(log) {
        delete log.recordId
        let dblog = await this.sqlInterface.InsertRow(log,VESSELDISINFECTIONMAP,config.kstConfig.sqlTables.VESSELDISINFECTION)
        return dblog
    }
    async ListVesselDisinfectionEligibleForPDF() {
        return await this.sqlInterface.PerformQueryPromise(`
            SELECT * FROM ${config.kstConfig.sqlTables.VESSELDISINFECTION}
            WHERE file_path IS NULL 
            ORDER BY record_id;
        `,[]);
    }
    async UpdateFilePath(recordId, filepath) {
        var update = {}
        var where = {}
        update[VESSELDISINFECTIONMAP.filepath.col] = filepath
        where[VESSELDISINFECTIONMAP.recordId.col] = recordId
        let temp_log = await this.sqlInterface.PerformUpdatePromise(config.kstConfig.sqlTables.VESSELDISINFECTION,update,where)
        return temp_log
    }
    async LockVesselDisinfectionPage(vesselId) {
        var lock = uuid()
        await this.sqlInterface.PerformUpdatePromise(config.kstConfig.sqlTables.LOCK, {
            pagelock : lock
        },{
            page : pagekey,
            vessel_id : vesselId
        })
        return lock
    }
    async CanViewVesselDisinfectionPage(vesselId, userlock) {
        let currentlock = await this.sqlInterface.PerformQueryPromise(`
            SELECT pagelock
            FROM ${config.kstConfig.sqlTables.LOCK}
            WHERE vessel_id=$1 AND page='${pagekey}'
        `,[vesselId])
        if (currentlock instanceof Array && currentlock.length > 0) {
            currentlock = currentlock[0].pagelock
            return currentlock === userlock||currentlock==null
        } else {
            return false
        }
    }
    async UnlockVesselDisinfectionPage(vesselId) {
        await this.sqlInterface.PerformQueryPromise(`
            UPDATE ${config.kstConfig.sqlTables.LOCK}
            SET pagelock = NULL
            WHERE vessel_id=$1 AND page='${pagekey}'
            RETURNING *;
        `,[vesselId])
        return true
    }
}
module.exports = {
    service : new VesselDisinfectionService(),
    mappings : {
        VESSELDISINFECTIONMAP
    },
}