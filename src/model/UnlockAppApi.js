import Model from "./Model.js";
import config from '../config/config';
class CrewWorkAndRestHour extends Model {
    GetVesselAndAppsList() {
        return new Promise((res, rej)=>{
            super.get('/vesselandapplist',{}, (value,error) => {
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
    UnlockApp(vesselId, app) {
        return new Promise((res, rej)=>{
            super.postReq('/unlockapp',{ page: app, vessel_id: vesselId, crew_id: '' }, (value,error) => {
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

    UnlockAppBrowserTabClose(vesselId,accountType,currentUser) {
        return new Promise((res, rej)=>{
            super.postReq('/unlockapp-browser-tab-close',{vessel_id: vesselId,accountType: accountType,currentUser: currentUser}, (value,error) => {
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