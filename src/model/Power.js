import Model from "./Model.js"

class Power extends Model {
    constructor() {
        super()
        this.tagname = ""
        this.value = -1000
    }
    
    GetPowerConsumptionHistory(callback) {
        super.postReq('/power/powerconsumption',{}, (value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }
    GetPowerFuelEfficiency(callback) {
        super.postReq('/power/efficiency',{}, (value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }
    GetPowerGeneration(callback) {
        super.postReq('/power/generation',{}, (value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }
    GetPowerDistribution(callback) {
        super.postReq('/power/distribution',{}, (value,error) => {
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
export default Power;