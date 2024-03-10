const ServiceManager = require('../services/ServiceManager.js')

class VesselReportApi {
    constructor () {
        this.serviceManager = new ServiceManager()
    }
    async HealthCheck() {
        var chatService = this.serviceManager.GetHealthCheckService();
        return chatService.HealthCheck();
    }
}
module.exports = new VesselReportApi();