const ServiceManager = require('../services/ServiceManager.js')

class vesselDashboardApi {
    constructor () {
        this.serviceManager = new ServiceManager()
    }
    async GetVesselDashboardData(vesselId, today) {
        var vesselDashboardService = this.serviceManager.GetVesselDashboardService()
        return await vesselDashboardService.GetVesselDashboardData(vesselId, today);
    }
    async GetVesselDashboardLastFiveMarinemData(vesselId) {
        try {
            var vesselDashboardService = this.serviceManager.GetVesselDashboardService()
            return await vesselDashboardService.GetVesselDashboardLastFiveMarinemData(vesselId); 
        } catch (error) {
            throw new Error(error.message); 
        }
    }
}
module.exports = new vesselDashboardApi();