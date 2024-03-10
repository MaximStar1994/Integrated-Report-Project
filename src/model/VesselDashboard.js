import Model from "./Model.js";
import config from '../config/config';
class VesselDashboard extends Model {    
    GetVesselDashboardData(vesselId, today) {
        return new Promise((res, rej)=>{
            super.get('/vesseldashboard/getdata',{vesselId: vesselId, today: today}, (value,error) => {
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

    GetVesselDashboardLastFiveMarinemData(vesselId) {
        return new Promise((res, rej)=>{
            super.get('/vesseldashboard/get_last_five_marinem_data',{vesselId: vesselId}, (value,error) => {
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

export default VesselDashboard;