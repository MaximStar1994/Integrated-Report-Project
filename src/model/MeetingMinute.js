import Model from "./Model.js"
import moment from 'moment-timezone';
class MeetingMinute extends Model {
    constructor() {
        super()
    }
    ListMeetingMinutes(callback) {
        super.get('/oxalis/meetingminute',{}, (value,error) => {
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
    GetMeetingMinute(id,callback) {
        super.get(`/oxalis/meetingminute/${id}`,{}, (value,error) => {
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
    PostMeetingMinute(meetingminute,callback) {
        super.postReq(`/oxalis/meetingminute`,meetingminute, (value,error) => {
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
export default MeetingMinute;