const config = require('../config/config')
const helper = require('../helper/helperWithoutApi')
const {interfaceObj} = require("./interfaces/PostGreSQLInterface")
const CREWMAP = {
    crewId : { col : "crew_id", type: "identity" },
    vesselId : { col : "vessel_id", type: "integer" },
    name : { col : "name", type: "string" }, 
}
class CrewService {
    constructor () {
        this.sqlInterface = interfaceObj
    }
    async ListCrew(vesselId) {
        let crew = await this.sqlInterface.PerformQueryPromise(`
            SELECT crew_id, name
            FROM ${config.kstConfig.sqlTables.CREW}
            WHERE vessel_id=$1
        `,[vesselId])
        crew.map(member => {
            member.crewId = member.crew_id
            delete member.crew_id
        })
        return crew
    }
    async GetCrew(crewId) {
        let where = {}
        where[CREWMAP.crewId.col] = crewId
        let crew = await this.sqlInterface.GetDataFromTable(
            config.kstConfig.sqlTables.CREW,CREWMAP,
            where)
        if (crew instanceof Array && crew.length > 0) {
            return crew[0]
        }
        return null
    }
    async UpdateCrew(crew) {
        var update = {}
        var where = {}
        Object.keys(CREWMAP).forEach(key => {
            if (CREWMAP[key].type != 'identity') {
                update = helper.updateObjForPG(crew[key],CREWMAP[key].col,update)
            }
        })
        where[CREWMAP.crewId.col] = crew.crewId
        return await this.sqlInterface.PerformUpdatePromise(config.kstConfig.sqlTables.CREW,update,where)
    }
    async AddCrew(crew) {
        return await this.sqlInterface.InsertRow(crew,CREWMAP,config.kstConfig.sqlTables.CREW)
    }
    async GetVesselIdOfCrew(crewId) {
        let rows = await this.sqlInterface.PerformQueryPromise(`
            SELECT vessel_id
            FROM ${config.kstConfig.sqlTables.CREW}
            WHERE crew_id=$1
        `,[crewId])
        if (rows.length > 0) {
            return rows[0].vessel_id
        } else {
            return null
        }
    }
}
module.exports = new CrewService();