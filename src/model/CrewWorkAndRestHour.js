import Model from "./Model.js";
import config from '../config/config';
class CrewWorkAndRestHour extends Model {
    CanViewCrewWorkAndRestHourPage(crewId, callback) {
        return new Promise(async (res, rej) => {
            var crewWorkAndRestHourLock = localStorage.getItem("CrewWorkAndRestHourLock")
                super.postReq('/crewworkandresthour/available',{lock : crewWorkAndRestHourLock, crewId: crewId}, (value,error) => {
                    if(!error){
                        if (value !== null) {
                            if(value.success === true){
                                localStorage.setItem("CrewWorkAndRestHourLock",value.value)
                            }
                            localStorage.setItem("CanViewCrewWorkAndRestHour",value.success)
                            callback(value.success, error)
                        } else {
                            localStorage.setItem("CanViewCrewWorkAndRestHour",false)
                            callback(false,null)
                        }
                    } else {
                        callback(localStorage.getItem("CanViewCrewWorkAndRestHour"),error)
                    }
                })
        });
    }
    UnlockCrewWorkAndRestHourPage(crewId, callback) {
        var crewWorkAndRestHourLock = localStorage.getItem("CrewWorkAndRestHourLock")
        if(crewWorkAndRestHourLock){
            return new Promise(async() => {
                super.postReq('/crewworkandresthour/unlock',{lock : crewWorkAndRestHourLock, crewId: crewId}, callback)
            })
        }
        else{
            callback(null, "Lock not found!");
        }
    }
    GetCrewList() {
        return new Promise((res, rej)=>{
            super.get('/crewworkandresthour/crewlist',{}, (value,error) => {
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
    GetCrewRestAndWorkHourData(employeeNo, month, year) {
        return new Promise((res, rej)=>{
            super.get('/crewworkandresthour/data',{employeeNo, month, year}, (value,error) => {
                if(!error){
                    if(value.success === true){
                        res(value.value);
                    }
                    else {
                        if(typeof(value.error) === 'string' && value.error.length>0)
                            rej(value.error);
                        else
                            rej("Unable to retrieve information!");
                    }
                }
                else {
                    rej("No internet!");
                }
            })
        });
    }
    GetPreviousSubmission(employeeNo, month, year) {
        return new Promise((res, rej)=>{
            super.get('/crewworkandresthour/prevsubmission',{employeeNo, month, year}, (value,error) => {
                if(!error){
                    if(value.success === true){
                        res(value.value);
                    }
                    else {
                        if(typeof(value.error) === 'string' && value.error.length>0)
                            rej(value.error);
                        else
                            rej("Unable to retrieve information!");
                    }
                }
                else {
                    rej("No internet!");
                }
            })
        });
    }
    PostCrewRestAndWorkHourData(data) {
        return new Promise((res, rej)=>{
            super.postReq('/crewworkandresthour/data',data, (value,error) => {
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
    GetCrewRestAndWorkHourUpdateData(month, year) {
        return new Promise((res, rej)=>{
            super.get('/crewworkandresthour/update',{month, year}, (value,error) => {
                if(!error){
                    if(value.success === true){
                        res(value.value);
                    }
                    else {
                        if(typeof(value.error) === 'string' && value.error.length>0)
                            rej(value.error);
                        else
                            rej("Unable to retrieve information!");
                    }
                }
                else {
                    rej("No internet!");
                }
            })
        });
    }
    PostCrewRestAndWorkHourUpdateData(data) {
        return new Promise((res, rej)=>{
            super.postReq('/crewworkandresthour/update',data, (value,error) => {
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

export default CrewWorkAndRestHour;