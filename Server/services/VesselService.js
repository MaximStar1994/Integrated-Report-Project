const config = require('../config/config')
const helper = require('../helper/helperWithoutApi')
const {interfaceObj} = require("./interfaces/PostGreSQLInterface")
class VesselService {
    constructor () {
        this.sqlInterface = interfaceObj
    }
    async GetVessel(vesselId) {
        let vessels = await this.sqlInterface.PerformQueryPromise(`
            SELECT vessel_id, name, timezone
            FROM ${config.kstConfig.sqlTables.VESSEL}
            WHERE vessel_id=$1
        `,[vesselId])
        if (vessels instanceof Array && vessels.length > 0) {
            let vessel = {
                vesselId : vessels[0].vessel_id,
                name : vessels[0].name,
                timezone : vessels[0].timezone
            }
            return vessel
        } else {
            return null
        }
    }
}
module.exports = new VesselService();