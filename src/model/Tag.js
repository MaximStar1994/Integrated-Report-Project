
import Model from "./Model.js"
import { openDB } from 'idb';
import config from '../config/config';

class Tag extends Model {
    constructor() {
        super()
        this.tagname = ""
        this.value = -1000
    }
    
    MonitorValue(tagname, callback) {
        const socket = this.socket
        socket.emit("monitorTag",tagname)
        socket.on(tagname, data => {
           callback(data)
        });
    }
    GetValue(tagname, callback) {
        super.postReq('/tag/value',
                        {
                            tagname : tagname 
                        },
                        callback)
    }
   
   GetTrendingTags(vesselId, callback) {
        // var vesselID = JSON.parse(localStorage.getItem('user'))?.vessels[0]?.vesselId;
        super.postReq('/tags/all',{vesselId: vesselId},(value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }

     GetTagTrend(vesselId, tagIdentifier,tagnames, startDT, endDT, callback, interval=3 ) {
        // var vesselID = JSON.parse(localStorage.getItem('user'))?.vessels[0]?.vesselId;
        super.postReq('/tag/trend',{
            tagIdentifier : tagIdentifier,
            tagnames : tagnames,
            startdate : startDT,
            enddate : endDT,
            vesselId : vesselId
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
export default Tag;