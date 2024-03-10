
import Model from "./Model.js"

class Rigmove extends Model {
    constructor() {
        super()
        this.tagname = ""
        this.value = -1000
    }
    
    GetBlackoutProbability(callback) {
        super.postReq('/rigmove/blackout',{}, (value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }
    GetSouceProviderHealth(callback) {
        super.postReq('/rigmove/sourceprovider',{}, (value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }
    GetValue(projname,mashupname, callback) {
     
        super.postReq('/iotag/currentvalue',{projname : projname,mashupname : mashupname},(value,error) => {
            var data = null
            if (value !== null) {
              
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }

    GetTagTrend(tagnames, startDT, endDT, callback, interval=5 ) {
			//console.log("endDate api" + endDT);
        super.postReq('/tag/trend',{
            tagnames : tagnames,
            startdate : startDT,
            enddate : endDT,
            interval : interval
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

    GetCycleCountForDrilling(startDT, endDT, callback, interval=5 ) {
        super.postReq('/rigmove/cyclecount',{
            startdate : startDT,
            enddate : endDT,
            interval : interval
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
export default Rigmove;