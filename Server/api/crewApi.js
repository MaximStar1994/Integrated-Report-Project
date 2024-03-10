const ServiceManager = require('../services/ServiceManager.js')
const helper = require('../helper/helper.js');
const permissionController = require('./permissionController')
class CrewApi {
    constructor () {
        this.serviceManager = new ServiceManager()
    }
    /*
    crewId : int
    vesselId : int
    name : string
    */
    async PostCrew(user, crew) {
        if (!permissionController.canCreateCrewForVessel(user, crew.vesselId)) {
            throw new Error("User unauthorized")
        }
        if (crew.crewId != null) {
            return await this.serviceManager.GetCrewService().UpdateCrew(crew)
        } else {
            return await this.serviceManager.GetCrewService().AddCrew(crew)
        }
    }
}
module.exports = new CrewApi();