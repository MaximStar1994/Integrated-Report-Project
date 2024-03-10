import Model from "./Model.js"
import moment from 'moment-timezone';
class EngineLogKST extends Model {
    constructor() {
        super()
    }
    ListEngineLogs(callback) {
        super.get('/kst/elog',{}, (value,error) => {
            if(!error){
                if (value && value.success) {
                    callback(value.value, null)
                } else {
                    callback([],value.error)
                }
            } else {
                callback([],error)
            }
        })
    }
    GetOpenEngineLog(callback) {
        super.get(`/kst/elog/open`,{}, (value,error) => {
            if(!error){
                if (value && value.success) {
                    callback(value.value, null)
                } else {
                    callback(null,value.error)
                }
            } else {
                callback(null,error)
            }
        })
    }
    GetEngineLog(id,callback) {
        super.get(`/kst/elog/${id}`,{}, (value,error) => {
            if(!error){
                if (value && value.success) {
                    callback(value.value, null)
                } else {
                    callback(null,value.error)
                }
            } else {
                callback(null,error)
            }
        })
    }
    PostEngineLog(elog,callback) {
        super.postReq(`/kst/elog/`,elog, (value,error) => {
            if(!error){
                if (value && value.success) {
                    callback(value.value, null)
                } else {
                    callback(null,value.error)
                }
            } else {
                callback(null,error)
            }
        })
    }
}
export default EngineLogKST;