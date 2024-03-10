import Model from "./Model.js"

class HumanFactor extends Model {
    constructor() {
        super()
        this.tagname = ""
        this.value = -1000
    }

    GetBPM(callback) {
        super.postReq('/humanfactor/getbpm', {}, (value, error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })

    }

    PostTask(req,callback){
        super.postReq('/wearable/task', req, (value, error) => {
            var data = null
            // console.log("PostTask data" + JSON.stringify(value)  )
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }

    GetCrew(callback) {
        super.get('/wearable/crew',{}, (value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }
    GetTask(callback) {
        super.get('/wearable/task',{}, (value,error) => {
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
export default HumanFactor;