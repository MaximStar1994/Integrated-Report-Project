const ServiceManager = require('../services/ServiceManager.js')
const helper = require('../helper/helperWithoutApi')
"use strict";
class ShipGeneralInfoApi {
    constructor () {
        this.serviceManager = new ServiceManager()
    }
    ListMasterAndOfficers(callback) {
        this.serviceManager.GetShipGeneralInfoApi().ListMasterAndOfficers(callback)
    }
    PostMasterAndOfficers(officers, callback) {
        var queries = 0
        if (officers instanceof Array) {
            officers.forEach(officer => {
                queries += 1
                if (helper.IsEmpty(officer.officerId)) {
                    this.serviceManager.GetShipGeneralInfoApi().AddMasterAndOfficer(officer, () => {
                        queries -= 1
                        if (queries == 0) {
                            this.ListMasterAndOfficers(callback)
                        }
                    })
                } else {
                    this.serviceManager.GetShipGeneralInfoApi().UpdateOfficer(officer, () => {
                        queries -= 1
                        if (queries == 0) {
                            this.ListMasterAndOfficers(callback)
                        }
                    })
                }
            })
        }
        if (queries == 0) {
            this.ListMasterAndOfficers(callback)
        }
    }
    GetCrewInfo(callback) {
        this.serviceManager.GetShipGeneralInfoApi().GetCrewInfo(callback)
    }
    UpdateCrewInfo(crewInfo, callback) {
        this.serviceManager.GetShipGeneralInfoApi().UpdateCrewInfo(crewInfo, callback)
    }
}
module.exports = ShipGeneralInfoApi;
