const ServiceManager = require("../services/ServiceManager");

class ExportCSVApi {
    constructor () {
        this.serviceManager = new ServiceManager()
    }
    async GetData(today) {
        var exportCSVService = this.serviceManager.GetExportCSVService();
        return await exportCSVService.GetData(today);
    }
    async GetVesselReportData(startDate, endDate, vesselId) {
        var exportCSVService = this.serviceManager.GetExportCSVService();
        return await exportCSVService.GetVesselReportDataForDatePeriod(startDate, endDate, vesselId);
    }
    async GetDailyLogData(startDate, endDate, vesselId) {
        var exportCSVService = this.serviceManager.GetExportCSVService();
        return await exportCSVService.GetDailyLogDataForDatePeriod(startDate, endDate, vesselId);
    }
    async GetFORHData(startDate, endDate, vesselId) {
        var exportCSVService = this.serviceManager.GetExportCSVService();
        return await exportCSVService.GetFORHDataForDatePeriod(startDate, endDate, vesselId);
    }
    async GetMissingLogs(startDate, endDate) {
        var exportCSVService = this.serviceManager.GetExportCSVService();
        return await exportCSVService.GetMissingLogs(startDate, endDate);
    }
}

module.exports = new ExportCSVApi();