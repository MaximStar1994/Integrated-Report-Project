import Model from "./Model.js";
import config from '../config/config';
class FleetDashboard extends Model {    
    GetFleetDashboardData(today) {
        return new Promise((res, rej)=>{
            super.get('/fleetdashboard/getdata',today, (value,error) => {
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

    GetFleetDashboardLastFiveMarinemData() {
        return new Promise((res, rej)=>{
            super.get('/fleetdashboard/get_last_five_marinem_data',{}, (value,error) => {
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

export default FleetDashboard;