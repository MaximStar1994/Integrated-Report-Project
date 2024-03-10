const ServiceManager = require("../services/ServiceManager");

class CrewPlanningApi {
    constructor () {
        this.serviceManager = new ServiceManager()
    }
    async GetUserNameFromAccountId(accountId){
        var crewPlanningPageService = this.serviceManager.GetCrewPlanningService()
        return await crewPlanningPageService.GetUserNameFromAccountId(accountId);
    }
    async CanViewCrewPlanningPage(userlock) {
        var crewPlanningPageService = this.serviceManager.GetCrewPlanningService()
        return await crewPlanningPageService.CanViewCrewPlanningPage(userlock);
    }
    async LockCrewPlanningPage(userlock, user) {
        var crewPlanningPageService = this.serviceManager.GetCrewPlanningService()
        let canview = await crewPlanningPageService.CanViewCrewPlanningPage(userlock)
        if (canview) {
            return crewPlanningPageService.LockCrewPlanningPage(user)
        } else {
            throw new Error("Another device is accessing this page now")
        }
    }
    async UnlockCrewPlanningPage(userlock) {
        var crewPlanningPageService = this.serviceManager.GetCrewPlanningService()
        let canview = await crewPlanningPageService.CanViewCrewPlanningPage(userlock)
        if (canview) {
            return await crewPlanningPageService.UnlockCrewPlanningPage()
        } else {
            let currentUser = await this.GetCurrentUser();
            throw new Error(`${currentUser} is accessing this page now`)
        }
    }
    async GetCurrentUser() {
        var crewPlanningPageService = this.serviceManager.GetCrewPlanningService();
        return await crewPlanningPageService.GetCurrentUser();
    }
    async GetCrewPlanningData() {
        var crewPlanningPageService = this.serviceManager.GetCrewPlanningService();
        return await crewPlanningPageService.GetCrewPlanningData();
    }
    async GetSpareCrewData() {
        var crewPlanningPageService = this.serviceManager.GetCrewPlanningService();
        return await crewPlanningPageService.GetSpareCrewData();
    }
    async UpdateCrewPlanningData(data) {
        var crewPlanningPageService = this.serviceManager.GetCrewPlanningService();
        return await crewPlanningPageService.UpdateCrewPlanningData(data);
    }
    async UpdateSpareData(data) {
        var crewPlanningPageService = this.serviceManager.GetCrewPlanningService();
        return await crewPlanningPageService.UpdateSpareData(data);
    }
}

module.exports = new CrewPlanningApi();