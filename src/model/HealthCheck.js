import Model from "./Model.js";
class HealthCheck extends Model {
    GetHealthCheck() {
        return new Promise((res, rej)=>{
            super.get('/gethealth',{}, (value,error) => {
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

export default HealthCheck;