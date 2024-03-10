import Model from "./Model.js"

class FuelLng extends Model {
    constructor() {
        super()
    }
    GetKpi(callback ) {
        super.get('/fuelLng/kpis',{},(value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }
    SetKpi(data, callback ) {
        super.postReq('/fuelLng/kpis',data,(value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }
    ListOfficers(callback) {
        super.get('/fuelLng/shipinfo/officers',{},(value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }
    PostOfficers(officers, callback) {
        super.postReq('/fuelLng/shipinfo/officers',{
            officers : officers
        },(value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }
    ListCrewInfo(callback) {
        super.get('/fuelLng/shipinfo/crew',{},(value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }
    UpdateCrewInfo(crewInfo, callback) {
        super.postReq('/fuelLng/shipinfo/crew',{
            crewInfo : crewInfo
        },(value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }
}
export default FuelLng;