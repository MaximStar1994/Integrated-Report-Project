const ServiceManager = require('../services/ServiceManager.js')

class fleetDashboardApi {
    constructor () {
        this.serviceManager = new ServiceManager()
    }
    async GetFleetDashboardData(today) {
        var fleetDashboardService = this.serviceManager.GetFleetDashboardService()
        return await fleetDashboardService.GetFleetDashboardData(today);
    }

    async GetFleetDashboardLastFiveMarinemData() {
        try {
            var fleetDashboardService = this.serviceManager.GetFleetDashboardService()
            return await fleetDashboardService.GetFleetDashboardLastFiveMarinemData(); 
        } catch (error) {
            throw new Error(error.message); 
        }
    }
}
module.exports = new fleetDashboardApi();