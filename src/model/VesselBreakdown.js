import Model from "./Model.js";
import config from '../config/config';
class VesselBreakdown extends Model {
    CanViewVesselBreakdownPage(vesselId, callback) {
        return new Promise(async (res, rej) => {
            var vesselBreakdownLock = localStorage.getItem("VesselBreakdownLock");
            let accountId = JSON.parse(localStorage.getItem('user')).accountId;
            // if(JSON.parse(localStorage.getItem('user')).vessels.length<=0){
            //     callback(false, "No vessels attached to this account!")
            // }
            // else{
                super.postReq('/vesselbreakdown/available',{lock : vesselBreakdownLock, vesselId: vesselId, accountId: accountId}, (value,error) => {
                    if(!error){
                        if (value !== null) {
                            if(value.success === true){
                                localStorage.setItem("VesselBreakdownLock",value.value)
                            }
                            localStorage.setItem("CanViewVesselBreakdown",value.success)
                            callback(value.success, value.error)
                        } else {
                            localStorage.setItem("CanViewVesselBreakdown",false)
                            callback(false,null)
                        }
                    } else {
                        callback(localStorage.getItem("CanViewVesselBreakdown"),error)
                    }
                })
            // }
        });
    }
    UnlockVesselBreakdownPage(vesselId, callback) {
        var vesselBreakdownLock = localStorage.getItem("VesselBreakdownLock")
        if(vesselId && vesselBreakdownLock){
            return new Promise(async() => {
                super.postReq('/vesselbreakdown/unlock',{lock : vesselBreakdownLock, vesselId: vesselId}, callback)
            })
        }
        else{
            callback(null, "Vessel ID / Lock not found!");
        }
    }
    GetVesselBreakdownData(vesselID,isManagement) {
        return new Promise((res, rej)=>{
            super.get('/vesselbreakdown/data',{vesselID: vesselID,isManagement:isManagement}, (value,error) => {
                if(!error){
                    if(value.success === true){
                        res(value.value);
                    }
                    else {
                        rej("Unable to retrieve information!");
                    }
                }
                else {
                    rej("No internet!");
                }
            })
        });
    }
    async PostVesselBreakdownRecords(breakdown, type) {
        const AuthStr = 'Bearer '.concat(localStorage.getItem("authenticationToken"));
        return new Promise((resolve, reject) => 
            fetch(this.apiEndPoint + `/vesselbreakdown/${type}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': AuthStr
                },
                body: JSON.stringify({breakdown : breakdown})
            }).then((response) => response.json())
                .then(async parsedJson => {
                resolve(parsedJson);
            }).catch((err) => {
                if(type==='save')
                    console.log('Unable to Save!!');
                else if(type==='submit')
                    console.log('Unable to Submit!!');
                reject(err);
            })    
        )
    }
    DeleteVesselBreakdown(eventId) {
        return new Promise((res, rej)=>{
            super.get('/vesselbreakdown/delete',{eventId: eventId}, (value,error) => {
                if(!error){
                    if(value.success === true){
                        res(value);
                    }
                    else {
                        rej("Unable to retrieve information!");
                    }
                }
                else {
                    rej("No internet!");
                }
            })
        });
    }
    vesselDowntimeStatusChange(event) {
        return new Promise((res, rej)=>{
            super.get('/vesselbreakdown/status-change',{eventId: event.eventId,status: event.status}, (value,error) => {
                if(!error){
                    if(value.success === true){
                        res(value);
                    }
                    else {
                        rej("Unable to retrieve information!");
                    }
                }
                else {
                    rej("No internet!");
                }
            })
        });
    }
}

export default VesselBreakdown;