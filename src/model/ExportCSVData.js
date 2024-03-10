import Model from "./Model.js";
import config from '../config/config';
class CrewPlanning extends Model {
    GetExportCSVData(data) {
        return new Promise((res, rej)=>{
            super.get('/exportcsv/data',data, (value,error) => {
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
    GetExportCSVDataForVesselReport(data) {
        return new Promise((res, rej)=>{
            super.get('/exportcsv/vesselreportdata',data, (value,error) => {
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

    GetExportCSVDataForFORH(data) {
        return new Promise((res, rej)=>{
            super.get('/exportcsv/forhdata',data, (value,error) => {
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

    GetExportCSVDataForMissingLogs(data) {
        return new Promise((res, rej)=>{
            super.get('/exportcsv/missinglogs',data, (value,error) => {
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