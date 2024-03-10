import Model from "./Model.js";
import config from '../config/config';
class CrewPlanning extends Model {
    CanViewCrewPlanningPage(callback) {
        return new Promise(async (res, rej) => {
            var crewPlanningLock = localStorage.getItem("CrewPlanningLock");
            let accountId = JSON.parse(localStorage.getItem('user')).accountId;
                super.postReq('/crewplanning/available',{ lock : crewPlanningLock, accountId: accountId }, (value,error) => {
                    if(!error){
                        if (value !== null) {
                            if(value.success === true){
                                localStorage.setItem("CrewPlanningLock",value.value)
                            }
                            localStorage.setItem("CanViewCrewPlanning",value.success)
                            callback(value.success, value.error)
                        } else {
                            localStorage.setItem("CanViewCrewPlanning",false)
                            callback(false,null)
                        }
                    } else {
                        callback(localStorage.getItem("CanViewCrewPlanning"),error)
                    }
                })
        });
    }
    UnlockCrewPlanningPage(callback) {
        var crewPlanningLock = localStorage.getItem("CrewPlanningLock")
        if(crewPlanningLock){
            return new Promise(async() => {
                super.postReq('/crewplanning/unlock',{lock : crewPlanningLock}, callback)
            })
        }
        else{
            callback(null, "Lock not found!");
        }
    }
    GetCrewPlanningData() {
        return new Promise((res, rej)=>{
            super.get('/crewplanning/data',{}, (value,error) => {
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
    PostCrewPlanningData(data) {
        return new Promise((res, rej)=>{
            super.postReq('/crewplanning/data',data, (value,error) => {
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
}

export default CrewPlanning;