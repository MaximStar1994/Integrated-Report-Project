const ServiceManager = require('../services/ServiceManager.js')
const helper = require('../helper/helper.js');

class PermissionController {
    constructor () {
        this.serviceManager = new ServiceManager()
    }
    canViewVessel(user, vesselId) {
        return user.vessels.filter(vessel => vessel.vesselId == vesselId).length > 0
    }
    canCreateCrewForVessel(user, vesselId) {
        return user.vessels.filter(vessel => vessel.vesselId == vesselId).length > 0
    }
    canCreateLogForVessel(user, vesselId) {
        return user.vessels.filter(vessel => vessel.vesselId == vesselId).length > 0
    }
    isAdmin(user) {
        return user.apps.filter(app => app == 'admin').length > 0
    }
    async canManageCrew(user, crewId) {
        let vesselId = await this.serviceManager.GetCrewService().GetVesselIdOfCrew(crewId)
        return this.canCreateLogForVessel(user,vesselId)
    }
}
module.exports = new PermissionController();