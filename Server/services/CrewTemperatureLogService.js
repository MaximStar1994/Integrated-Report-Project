const config = require('../config/config');
const helper = require('../helper/helperWithoutApi');
const {interfaceObj} = require("./interfaces/PostGreSQLInterface");
const moment = require('moment');
const { uuid } = require('uuidv4');
const pagekey = "CREWTEMPERATURELOG";

const VESSELCREWTEMPERATURELOGMAP = {
    vesselId : { col : "vessel_id", type: "integer" },
    vesselName : { col : "vessel_name", type: "string"},
    dateSubmitted : { col : "date_submitted", type: "datetime" },
    filepath : { col : "file_path", type: "string" }, 
    recordId : { col : "record_id", type: "identity" },
}

const CREWTEMPERATURELOGMAP = {
    crewId : { col: "crew_id", type: "decimal"},
    employeeNo: { col: "employee_no", type: "string"},
    name : { col: "name", type: "string"},
    temp1 : { col: "temp1", type: "decimal"},
    temp2 : { col: "temp2", type: "decimal"},
    symptomsInLast14Days : { col: "symptoms_in_last_14_days", type: "bool"},
    symptoms : { col: "symptoms", type: "string"},
    firstARISymptoms : { col: "first_ari_symptoms", type: "string"},
    contactWithSuspected : { col: "contact_with_suspected", type: "bool"},
    testDate : { col: "test_date", type: "datetime"},
    pcr : { col: "pcr", type: "bool"},
    art : { col: "art", type: "bool"}
}


class CrewTemperatureLogService {
    constructor () {
        this.sqlInterface = interfaceObj
    }
    async GetVesselInfo(vesselId) {
        var vesselName = await this.sqlInterface.PerformQueryPromise(`
            SELECT vessel_id as id, name
            FROM ${config.kstConfig.sqlTables.VESSEL}
            WHERE vessel_id=$1
        `,[vesselId]);
        var crewNames = await this.sqlInterface.PerformQueryPromise(`
            SELECT crew_id, name, rank, employee_no
            FROM ${config.kstConfig.sqlTables.CREW}
            WHERE vessel_id=$1
        `,[vesselId])
        if(vesselName instanceof Array && vesselName.length>0){
            vesselName[0].crew = crewNames;
        }
        return vesselName[0];
    }
    async GetTemperatureReport(recordId){
        let temperatureReports = await this.sqlInterface.GetDataFromTable(config.kstConfig.sqlTables.TEMPERATURELOG, VESSELCREWTEMPERATURELOGMAP, {record_id : recordId}, null)
        if (temperatureReports instanceof Array && temperatureReports.length > 0) {
            let temperatureReport = temperatureReports[0];
            temperatureReport.crew = await this.GetCrewTemperatureReport(recordId, config.kstConfig.sqlTables.CREWTEMPERATURE, CREWTEMPERATURELOGMAP, "crew_id")
            return temperatureReport;
        }
        else{
            return []
        }
    }
    async GetCrewTemperatureReport(recordId, tablename, mapping, orderByCol){
        return await this.sqlInterface.GetDataFromTable( tablename, mapping, { record_id : recordId }, orderByCol)
    }
    async CreateCrewTemperatureRecord(log) {
        delete log.recordId
        let dblog = await this.sqlInterface.InsertRow(log,VESSELCREWTEMPERATURELOGMAP,config.kstConfig.sqlTables.TEMPERATURELOG)
        let recordId = dblog.record_id;
        await this.InsertTemperature(log.crew, CREWTEMPERATURELOGMAP, config.kstConfig.sqlTables.CREWTEMPERATURE, recordId);
        log.recordId = recordId;
        return log;
    }
    async InsertTemperature(datarows, mapping, tablename, recordId){
        if (datarows instanceof Array && datarows.length > 0) {
            var insertList = []
            datarows.forEach((log,i) => {
                if(!helper.IsEmpty(log.name)){
                    let temp_log = {
                        record_id : recordId
                    }
                    Object.keys(mapping).forEach(key => {
                        temp_log[mapping[key].col] = log[key]
                    })
                    insertList.push(temp_log)
                }
            })
            return await this.sqlInterface.PerformBatchInsertPromise(tablename,insertList)
        } else {
            return []
        }
    }
    async ListTemperatureReports(vesselId) {
        let temperatureReports = await this.sqlInterface.PerformQueryPromise(`
            SELECT record_id, date_submitted FROM ${config.kstConfig.sqlTables.TEMPERATURELOG}
            WHERE vessel_id = $1
            ORDER BY record_id DESC;
        `,[vesselId]);
        if (temperatureReports instanceof Array && temperatureReports.length > 0) {
            var reportsEligible = [];
            for (const row of temperatureReports){
                const report = await this.GetTemperatureReport(row.record_id); 
                report.submittedDate = moment(row.submittedDate).format('DD-MMM-YY');
                reportsEligible.push(report);
            }
            return reportsEligible;
        } else {
            return [];
        }
    }
    async ListCrewTemperatureRecordsEligibleForPDF() {
        let temperatureReports = await this.sqlInterface.PerformQueryPromise(`
            SELECT record_id, date_submitted FROM ${config.kstConfig.sqlTables.TEMPERATURELOG}
            WHERE file_path IS NULL 
            ORDER BY record_id DESC;
        `,[]);
        if (temperatureReports instanceof Array && temperatureReports.length > 0) {
            var reportsEligible = [];
            for (const row of temperatureReports){
                const report = await this.GetTemperatureReport(row.record_id); 
                report.submittedDate = moment(row.submittedDate).format('DD-MMM-YY');
                reportsEligible.push(report);
            }
            return reportsEligible;
        } else {
            return [];
        }
    }
    async UpdateFilePath(recordId, filepath) {
        var update = {}
        var where = {}
        update[VESSELCREWTEMPERATURELOGMAP.filepath.col] = filepath
        where[VESSELCREWTEMPERATURELOGMAP.recordId.col] = recordId
        let temp_log = await this.sqlInterface.PerformUpdatePromise(config.kstConfig.sqlTables.TEMPERATURELOG,update,where)
        return temp_log
    }
    async LockCrewTemperatureRecordPage(vesselId) {
        var lock = uuid()
        await this.sqlInterface.PerformUpdatePromise(config.kstConfig.sqlTables.LOCK, {
            pagelock : lock
        },{
            page : pagekey,
            vessel_id : vesselId
        })
        return lock
    }
    async CheckSubmissionForToday(vesselId) {
        let todaySubmission = await this.sqlInterface.PerformQueryPromise(`
            SELECT *
            FROM ${config.kstConfig.sqlTables.TEMPERATURELOG}
            WHERE vessel_id=$1 AND CAST(date_submitted AS DATE)=CAST(CURRENT_TIMESTAMP AS DATE)
        `,[vesselId])
        if (todaySubmission instanceof Array && todaySubmission.length > 0) {
            return true
        } else {
            return false
        }
    }
    async CanViewCrewTemperatureRecordPage(vesselId, userlock) {
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
    async UnlockCrewTemperatureRecordPage(vesselId) {
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
    service : new CrewTemperatureLogService(),
    mappings : {
        VESSELCREWTEMPERATURELOGMAP,
        CREWTEMPERATURELOGMAP
    },
}