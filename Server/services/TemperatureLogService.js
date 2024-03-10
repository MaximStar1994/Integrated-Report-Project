const config = require('../config/config')
const helper = require('../helper/helperWithoutApi')
const {interfaceObj} = require("./interfaces/PostGreSQLInterface")
const moment = require('moment')

const TEMPERATURELOGMAP = {
    dateSubmitted : { col : "date_submitted", type: "datetime" },
    crewId : { col : "crew_id", type: "integer" }, 
    temperature : { col : "temperature", type: "decimal" }, 
    daySlot : { col : "slot", type: "integer" }, 
    filepath : { col : "file_path", type: "string" }, 
    logId : { col : "log_id", type: "identity" }, 
}

class TemperatureLogService {
    constructor () {
        this.sqlInterface = interfaceObj
    }
    async GetTemperatureLogs(year,week,vesselId) {
        let week_searching = moment().year(year).week(week)
        let week_searching_monday = week_searching.isoWeekday(1).clone().minute(0).hour(0).second(0)
        let week_searching_sunday = week_searching.isoWeekday(7).clone().minute(0).hour(0).second(0)
        let cols = Object.values(TEMPERATURELOGMAP).map(field => `l.${field.col}`)
        var dblogs = await this.sqlInterface.PerformQueryPromise(`
        SELECT ${cols.join(",")},c.name AS crew_name
        FROM ${config.kstConfig.sqlTables.TEMPERATURELOG} AS l
        JOIN ${config.kstConfig.sqlTables.CREW} AS c ON c.crew_id = l.crew_id
        WHERE l.date_submitted >= $1 AND l.date_submitted <= $2 AND c.vessel_id = $3
        `,[week_searching_monday,week_searching_sunday,vesselId])
        return dblogs.map(log => {
            let parsed = {}
            Object.keys(TEMPERATURELOGMAP).forEach(key => {
                parsed[key] = log[TEMPERATURELOGMAP[key].col]
            })
            return parsed
        })
    }

    async PostTemperatureLog(log) {
        await this.sqlInterface.PerformQueryPromise(`
        DELETE FROM ${config.kstConfig.sqlTables.TEMPERATURELOG} 
        WHERE ${TEMPERATURELOGMAP.crewId.col} = $1 AND ${TEMPERATURELOGMAP.daySlot.col} = $2 AND ${TEMPERATURELOGMAP.dateSubmitted.col} = $3`,[
            log.crewId, log.daySlot, log.dateSubmitted
        ])
        let dblog = await this.sqlInterface.InsertRow(log,TEMPERATURELOGMAP,config.kstConfig.sqlTables.TEMPERATURELOG)
        return dblog
    }
    async UpdateTemperatureLogFilePath(logId, filepath) {
        var update = {}
        var where = {}
        update[TEMPERATURELOGMAP.filepath.col] = filepath
        where[TEMPERATURELOGMAP.logId.col] = logId
        let temp_log = await this.sqlInterface.PerformUpdatePromise(config.kstConfig.sqlTables.TEMPERATURELOG,update,where)
        return temp_log
    }
}
module.exports = {
    service : new TemperatureLogService(),
    mappings : {
        TEMPERATURELOGMAP
    },
}