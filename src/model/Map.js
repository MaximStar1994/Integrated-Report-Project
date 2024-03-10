
import Model from "./Model.js"

class Map extends Model {
    constructor() {
        super()
        this.tagname = ""
        this.value = -1000
    }
    GetTagTrend(tagnames, startDT, endDT, callback, interval=3 ) {
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
}
export default Map;