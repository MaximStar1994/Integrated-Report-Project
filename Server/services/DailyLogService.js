const config = require('../config/config')
const helper = require('../helper/helperWithoutApi')
const {interfaceObj} = require("./interfaces/PostGreSQLInterface")
const moment = require('moment-timezone')
const { uuid } = require('uuidv4');
const pagekey = "DAILYLOG"

const DAILYLOGMAP = {
    formId : { col : "form_id", type: "identity" },
    vesselId : { col : "vessel_id", type: "integer" }, 
    filepath : { col : "file_path", type: "string" },
    captainName : {col: "captain_name", type: "string"},
    captainSignature : {col: "captain_signature", type: "string"},
    chiefEngineerName : {col: "chief_engineer_name", type: "string"},
    chiefEngineerSignature : {col: "chief_engineer_signature", type: "string"}, 
    remark : { col : "remark", type: "string" },
    formDate : { col : "form_date", type: "datetime" },
    reportDate: { col : "report_date", type: "string" },
    is_backdated: { col: "is_backdated", type: "bool" },
    is_offline: { col: "is_offline", type: "bool" },
    desktopFormID: {col: "desktop_app_form_id",type: "integer"}
}
const ENGINEIDENTIFIERS = {
    SMainEngine : "S",
    PMainEngine : "P",
}
const ELOGMAPPING = {
    engineIdentifier : { col : "engine_identifier", type: "string" },
    carryForwardRunningHour: {col: "carry_forward_running_hour", type: 'decimal'},
    runningHour : {col: "running_hour", type: 'decimal'},
    LNGcarryForwardRunningHour: {col: "lng_carry_forward_running_hour", type: 'decimal'},
    LNGrunningHour : {col: "lng_running_hour", type: 'decimal'},
    totalRunningHour:  {col: "total_running_hour", type: 'decimal'},
    totalLNGRunningHour:  {col: "total_lng_running_hour", type: 'decimal'},
}
const GENERATORIDENTIFIERS = {
    AE1 : "AE1",
    AE2 : "AE2",
    AE3 : "AE3",
}
const GENERATORMAPPING = {
    carryForwardRunningHour: {col: "carry_forward_running_hour", type: 'decimal'},
    runningHour : {col: "running_hour", type: 'decimal'},
    totalRunningHour:  {col: "total_running_hour", type: 'decimal'},
    generatorIdentifier : { col : "generator_identifier", type: "string" },
}
const ROBIDENTIFERS = {
    GRADE40 : "Grade 40",
    GRADE46 : "Grade 46",
    GRADE68 : "Grade 68",
    GRADE100 : "Grade 100",
    GRADEP100 : "Grade P100",
    FUELOIL : "Fuel Oil",
    FRESHWATER : "Fresh Water"
}
const ROBMAP = {
    identifier :  { col : "identifier", type: "string" },
    carryForward: { col : "carry_forward_rob", type: 'decimal' },
    received :  { col : "received", type: "decimal" },
    consumed :  { col : "consumed", type: "decimal" },
    rob :  { col : "rob", type: "decimal" },
}
const TANKSOUNDINGIDENTIFIERS = {
    FODAY1 : "FODAY1",
    FODAY2 : "FODAY2",
    FO1 : "FO1",
    FO2 : "FO2",
    FO3 : "FO3",
    FO4 : "FO4",
    FO5 : "FO5",
    FO6 : "FO6",
    FW1 : "FW1",
    FW2 : "FW2",
    LO : "LO",
    HYDRAULIC: "H",
    SEWAGE : "S",
    GRAYWATER : "GW",
    WASTEROIL : "WO",
    OILYWATER : "OW",
    SLUDGE : "SLUDGE",
    DISPERSANT : "DIS",
    FOAM : "FOAM",
    BALLAST1 : "B1",
    BALLAST2 : "B2",
    BALLAST3 : "B3",
    BALLAST4 : "B4",
}
const TANKSOUNDINGMAP = {
    identifier :  { col : "identifier", type: "string" },
    level :  { col : "level_reading", type: "decimal" },
    volume :  { col : "volume", type: "decimal" },
}

class DailyLogService {
    constructor () {
        this.sqlInterface = interfaceObj
    }
    async LockDailyLogPage(vesselId) {
        var lock = uuid()
        await this.sqlInterface.PerformUpdatePromise(config.kstConfig.sqlTables.LOCK, {
            pagelock : lock
        },{
            page : pagekey,
            vessel_id : vesselId
        })
        return lock
    }
    async CanViewDailyLogPage(vesselId, userlock) {
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
    async GetVessel(vesselId) {
        var vesselName = await this.sqlInterface.PerformQueryPromise(`
            SELECT vessel_id as id, name
            FROM ${config.kstConfig.sqlTables.VESSEL}
            WHERE vessel_id=$1
        `,[vesselId])
        return vesselName[0];
    }
    async GetGeneratorStructure(vesselId) {
        var generators = await this.sqlInterface.PerformQueryPromise(`
            SELECT generator_identifier
            FROM ${config.kstConfig.sqlTables.GENERATOR}
            WHERE vessel_id=$1 ORDER BY order_id
        `,[vesselId])
        return generators;
    }
    async GetRobStructure(vesselId) {
        var rob = await this.sqlInterface.PerformQueryPromise(`
            SELECT rob_identifier, order_id as orderid
            FROM ${config.kstConfig.sqlTables.ROB}
            WHERE vessel_id=$1 ORDER BY order_id
        `,[vesselId])
        return rob;
    }
    async GetTankSounding(vesselId) {
        var tankSounding = await this.sqlInterface.PerformQueryPromise(`
            SELECT identifier, max_depth, max_volume, order_id as orderid
            FROM ${config.kstConfig.sqlTables.TANKSOUNDING}
            WHERE vessel_id=$1 ORDER BY order_id
        `,[vesselId])
        return tankSounding;
    }
    async GetVesselName(vesselId){
        let vesselName = await this.sqlInterface.PerformQueryPromise(`
        SELECT name FROM ${config.kstConfig.sqlTables.VESSEL} WHERE vessel_id=$1
        `, [vesselId]);
        if(vesselName instanceof Array && vesselName.length>0){
            return vesselName[0].name;
        }
    }
    async UnlockDailyLogPage(vesselId) {
        await this.sqlInterface.PerformQueryPromise(`
            UPDATE ${config.kstConfig.sqlTables.LOCK}
            SET pagelock = NULL
            WHERE vessel_id=$1 AND page='${pagekey}'
            RETURNING *;
        `,[vesselId])
        return true
    }
    async ListDailyLogs(vesselId) {
        let dailyLogs = await this.sqlInterface.PerformQueryPromise(`
            SELECT form_id as formid, form_date AS formdate, report_date as reportdate, file_path as filepath, vessel_id, is_backdated as backdated, is_offline as offline
            FROM ${config.kstConfig.sqlTables.DAILYLOGFORM}
            WHERE vessel_id = $1
            ORDER BY form_date DESC;
        `,[vesselId]);
        dailyLogs.forEach(element=>{
            element.reportDate = element.reportdate;
            delete element.reportdate;
        })
        return dailyLogs;
    }
    async ListDailyLog(vesselId) {
        let dailyLogs = await this.sqlInterface.PerformQueryPromise(`
            SELECT form_id 
            FROM ${config.kstConfig.sqlTables.DAILYLOGFORM}
            WHERE vessel_id = $1
            ORDER BY form_date DESC;
        `,[vesselId])
        return await Promise.all(dailyLogs.map((id) => {
            return this.GetDailyLog(id.form_id)
        }))
    }
    async ListDailyLogEligibleForPDF() {
        let dailyLogs = await this.sqlInterface.PerformQueryPromise(`
            SELECT form_id, form_date AS formdate, report_date AS reportdate FROM ${config.kstConfig.sqlTables.DAILYLOGFORM}
            WHERE file_path IS NULL 
            AND chief_engineer_signature IS NOT NULL AND chief_engineer_signature != ''
            AND chief_engineer_name IS NOT NULL AND chief_engineer_name != ''
            AND captain_signature IS NOT NULL AND captain_signature != ''
            AND captain_name IS NOT NULL AND captain_name != ''
            ORDER BY form_date DESC;
        `,[]);
        if (dailyLogs instanceof Array && dailyLogs.length > 0) {
            var reportsEligible = [];
            for (const row of dailyLogs){
                const report = await this.GetDailyLog(row.form_id); 
                report.formdate = moment(row.formdate).format('DD-MMM-YY');
                reportsEligible.push(report);
            }
            return reportsEligible;
        } else {
            return [];
        }
    }
    async GetDailyLog(reportId) {
        let dailyLogs = await this.sqlInterface.GetDataFromTable(config.kstConfig.sqlTables.DAILYLOGFORM, DAILYLOGMAP, {form_id : reportId}, null)
        if (dailyLogs instanceof Array && dailyLogs.length > 0) {
            let dailyLog = dailyLogs[0]
            dailyLog.engines = await this.GetDailyLogPageRelatedData(reportId, config.kstConfig.sqlTables.DAILYLOGENGINELOG, ELOGMAPPING, ELOGMAPPING.engineIdentifier.col)
            dailyLog.generators = await this.GetDailyLogPageRelatedData(reportId, config.kstConfig.sqlTables.DAILYLOGGENERATOR, GENERATORMAPPING, GENERATORMAPPING.generatorIdentifier.col)
            dailyLog.rob = await this.GetDailyLogPageRelatedData(reportId, config.kstConfig.sqlTables.DAILYLOGROB, ROBMAP, ROBMAP.identifier.col)
            dailyLog.tanksoundings = await this.GetDailyLogPageRelatedData(reportId, config.kstConfig.sqlTables.DAILYLOGTS, TANKSOUNDINGMAP, TANKSOUNDINGMAP.identifier.col)
            return dailyLog
        } else {
            return null
        }
    }
    async GetDailyLogPageRelatedData(reportId, tablename, mapping, orderByCol) {
        return await this.sqlInterface.GetDataFromTable( tablename, mapping, { daily_log_form_id : reportId }, orderByCol)
    }
    
    async CreateDailyLog(dailyLog) {
        delete dailyLog.formDate;
        await this.multipleDailyLogInSameDateCheck(dailyLog);
        let dbDailyLog = await this.sqlInterface.InsertRow(dailyLog,DAILYLOGMAP,config.kstConfig.sqlTables.DAILYLOGFORM)
        let dailyLogId = dbDailyLog.form_id
        if (dailyLog.engines instanceof Array && dailyLog.engines.length > 0) {
            await this.InsertDailyLogRelatedData(dailyLog.engines, ELOGMAPPING, config.kstConfig.sqlTables.DAILYLOGENGINELOG, dailyLogId)
        }
        if (dailyLog.generators instanceof Array && dailyLog.generators.length > 0) {
            await this.InsertDailyLogRelatedData(dailyLog.generators, GENERATORMAPPING, config.kstConfig.sqlTables.DAILYLOGGENERATOR, dailyLogId)
        }
        if (dailyLog.rob instanceof Array && dailyLog.rob.length > 0) {
            await this.InsertDailyLogRelatedData(dailyLog.rob, ROBMAP, config.kstConfig.sqlTables.DAILYLOGROB, dailyLogId)
        }
        if (dailyLog.tanksoundings instanceof Array && dailyLog.tanksoundings.length > 0) {
            await this.InsertDailyLogRelatedData(dailyLog.tanksoundings, TANKSOUNDINGMAP, config.kstConfig.sqlTables.DAILYLOGTS, dailyLogId)
        }
        dailyLog.formId = dailyLogId
        return dailyLog
    }
    async multipleDailyLogInSameDateCheck(dailyLog) {
        try {
            await this.sqlInterface.PerformQueryPromise(
            `
                            UPDATE ${config.kstConfig.sqlTables.DAILYLOGFORM}
                            SET is_redundant = true
                            WHERE report_date=$1 and vessel_id=$2;
                        `,
            [dailyLog.reportDate, dailyLog.vesselId]
            );
        } catch (error) {
          throw new Error(error);
        }
    }
    async UpdateDailyLogFilePath(reportId, filepath) {
        var update = {
            file_path : filepath
        }
        let dailyLog = await this.sqlInterface.PerformUpdatePromise(
            config.kstConfig.sqlTables.DAILYLOGFORM,
            update,
            {form_id : reportId})
        return dailyLog
    }
    async InsertDailyLogRelatedData(datarows, mapping, tablename, formId, isOrdered = false) {
        if (datarows instanceof Array && datarows.length > 0) {
            var insertList = []
            datarows.forEach((log,i) => {
                let temp_log = {
                    daily_log_form_id : formId
                }
                if (isOrdered) {
                    temp_log.order_priority = i
                }
                Object.keys(mapping).forEach(key => {
                    temp_log[mapping[key].col] = log[key]
                })
                insertList.push(temp_log)
            })
            return await this.sqlInterface.PerformBatchInsertPromise(tablename,insertList)
        } else {
            return []
        }
    }
}
module.exports = {
    service : new DailyLogService(),
    mappings : {
        dailyLog : DAILYLOGMAP,
        rob : ROBMAP,
        tanksounding : TANKSOUNDINGMAP
    },
    identifiers : {
        ENGINEIDENTIFIERS,
        GENERATORIDENTIFIERS,
        ROBIDENTIFERS,
        TANKSOUNDINGIDENTIFIERS
    }
}