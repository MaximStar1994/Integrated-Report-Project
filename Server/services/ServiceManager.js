const OPCUAController = require('./interfaces/OPCUAInterface.js')
const OPCUAService = require('./OPCUAService.js')
const UserAccountService = require('./UserAccountService.js')
const DocumentManagementService = require('./DocumentManagementService')
const VesselReportService = require('./VesselReportService')
const DailyLogService = require('./DailyLogService')
const CrewPlanningService = require('./CrewPlanningService')
const CrewService = require('./CrewService')
const VesselService = require('./VesselService')
const TempLogService = require('./CrewTemperatureLogService')
const DisinfectionService = require('./VesselDisinfectionService')
const VesselBreakdownService = require('./VesselBreakdownService')
const CrewWorkAndRestHourService = require('./CrewWorkAndRestHourService');
const VesselDashboardService = require('./VesselDashboardService');
const FleetDashboardService = require('./FleetDashboardService');
const ExportCSVService = require('./ExportCSVService');
const AnalyticsService = require('./AnalyticsService');
const MailService = require('./MailService');
const ChatService = require('./ChatService');
const HealthCheckService = require('./HealthCheckService');
class ServiceManager {
    constructor () {
        this.monitoredTags = []
        var opcuaInterface = new OPCUAController()
        this.opcuaInterface = opcuaInterface
        if (this.opcuaService === undefined) {
            this.opcuaService = new OPCUAService(opcuaInterface)
        }
        this.userAccountApi = UserAccountService
        
        this.vesselReportService = VesselReportService.service
        this.dailyLogService = DailyLogService.service
        this.crewPlanningService = CrewPlanningService.service
        this.vesselBreakdownService = VesselBreakdownService.service
        this.tempLogService = TempLogService.service
        this.crewService = CrewService
        this.vesselService = VesselService
        this.disinfectionService = DisinfectionService.service
        this.crewWorkAndRestHourService = CrewWorkAndRestHourService.service
        this.vesselDashboardService = VesselDashboardService.service
        this.fleetDashboardService = FleetDashboardService.service
        this.exportCSVService = ExportCSVService.service
        this.analyticsService = AnalyticsService.service
        this.chatService = ChatService.service
        this.healthCheckService = HealthCheckService.service
        this.documentService = new DocumentManagementService()
    }
    GetVesselBreakdownService() {
        return this.vesselBreakdownService
    }
    GetVesselDisinfectionService() {
        return this.disinfectionService
    }
    GetTemperatureLogService() {
        return this.tempLogService
    }
    GetVesselService() {
        return this.vesselService
    }
    GetVesselReportService() {
        return this.vesselReportService
    }
    GetDailyLogService() {
        return this.dailyLogService
    }
    GetCrewPlanningService() {
        return this.crewPlanningService
    }
    GetCrewService() {
        return this.crewService
    }
    GetUserAccountApi() {
        return this.userAccountApi
    }
    GetCrewWorkAndRestHourService() {
        return this.crewWorkAndRestHourService
    }
    GetVesselDashboardService() {
        return this.vesselDashboardService
    }
    GetFleetDashboardService() {
        return this.fleetDashboardService
    }
    GetAnalyticsService() {
        return this.analyticsService
    }
    GetDocumentManagementService() {
        return this.documentService
    }
    GetExportCSVService() {
        return this.exportCSVService
    }
    GetChatService() {
        return this.chatService
    }
    GetHealthCheckService() {
        return this.healthCheckService
    }
}
module.exports = ServiceManager;
