import Model from "./Model.js";
import config from '../config/config';
import { openDB } from 'idb';
// const SYNCQUEUEDBNAME = "vesselDisinfectionQueued"
class VesselDisinfection extends Model {
    CanViewVesselDisinfectionPage(callback) {
        return new Promise(async (res, rej) => {
            var vesselDisinfectionLock = localStorage.getItem("VesselDisinfectionLock")
            if(JSON.parse(localStorage.getItem('user')).vessels.length<=0){
                callback(false, "No vessels attached to this account!")
            }
            else{
                var vesselID = JSON.parse(localStorage.getItem('selectedVessel'))?.vessel_id;
                var accountType = JSON.parse(localStorage.getItem('user')).accountType.toLowerCase();
                if (vesselID && accountType) {
                    super.postReq('/vesseldisinfection/available', { lock: vesselDisinfectionLock, vesselID: vesselID, accountType: accountType }, (value, error) => {
                        if (!error) {
                            if (value !== null) {
                                if (value.success === true) {
                                    localStorage.setItem("VesselDisinfectionLock", value.value)
                                }
                                localStorage.setItem("CanViewVesselDisinfection", value.success)
                                callback(value.success, error)
                            } else {
                                localStorage.setItem("CanViewVesselDisinfection", false)
                                callback(false, null)
                            }
                        } else {
                            if (localStorage.getItem("CanViewVesselDisinfection") === true || localStorage.getItem("CanViewVesselDisinfection") === 'true') {
                                callback(true, null);
                            }
                            else {
                                callback(false, error)
                            }
                        }
                    })
                }
            }
        });
    }
    async CheckSubmissionForToday(){
        var vesselID = JSON.parse(localStorage.getItem('user'))?.vessels[0]?.vesselId;
        return new Promise(async(resolve, reject) => {
            super.get('/vesseldisinfection/checksubmissionfortoday',{vesselId: vesselID}, async(value, error) => {
                if(!error){
                    console.log(value);
                    resolve(value.value);
                } else {
                    reject(error);
                }
            })
        })
    }
    UnlockVesselDisinfectionPage(callback) {
        var vesselDisinfectionLock = localStorage.getItem("VesselDisinfectionLock")
        var vesselID = JSON.parse(localStorage.getItem('selectedVessel'))?.vessel_id;
        if(vesselID && vesselDisinfectionLock){
            return new Promise(async() => {
                super.postReq('/vesseldisinfection/unlock',{lock : vesselDisinfectionLock, vesselID: vesselID}, callback)
            })
        }
        else{
            callback(null, "Vessel ID / Lock not found!");
        }
    }
    GetVesselData() {
        return new Promise((res, rej)=>{
            var vesselID = JSON.parse(localStorage.getItem('user')).vessels[0].vesselId;
            super.get('/vesseldisinfection/vesseldata',{vesselID: vesselID}, (value,error) => {
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
    // async SyncVesselDisinfectionRecords() {
    //     const db = await getVesselDisinfectionQueueDB();
    //     let vesselDisinfectionToSync = await db.getAll(SYNCQUEUEDBNAME)
    //     const AuthStr = 'Bearer '.concat(localStorage.getItem("authenticationToken"));
    //     return new Promise(resolve => 
    //         fetch(this.apiEndPoint + `/vesseldisinfection/sync`, {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'Authorization': AuthStr
    //             },
    //             body: JSON.stringify({logs : vesselDisinfectionToSync})
    //         }).then((response) => response.json())
    //             .then(async parsedJson => {
    //             if(vesselDisinfectionToSync.length>0 && parsedJson.success===true){
    //                 await db.clear(SYNCQUEUEDBNAME)
    //             }
    //             resolve(parsedJson);
    //         }).catch((err) => {
    //             console.log('Unable to Sync!!');
    //             resolve(null);
    //         })    
    //     )
    // }
    // async ForceSyncVesselDisinfection() {
    //     try{
    //         await this.SyncVesselDisinfectionRecords();
    //     }
    //     catch(e) {
    //         console.log("Force Sync Error: ", e);
    //     }

    // }
    async SubmitVesselDisinfection (data) {
        const AuthStr = 'Bearer '.concat(localStorage.getItem("authenticationToken"));
        return new Promise((resolve, reject) => 
            fetch(this.apiEndPoint + `/vesseldisinfection/sync`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': AuthStr
                },
                body: JSON.stringify({logs : [data]})
            }).then((response) => response.json())
                .then(async parsedJson => {
                resolve(parsedJson);
            }).catch((err) => {
                console.log('Unable to Sync!!');
                reject(err);
            })    
        )
    }
}

// async function submitVesselDisinfection(data) {
//     const logqueue = await getVesselDisinfectionQueueDB();
//     const tx = logqueue.transaction(SYNCQUEUEDBNAME, 'readwrite');

//     await tx.store.add(data)
//     return await tx.done;
// }
// export async function getVesselDisinfectionQueueDB() {
//     return await openDB(SYNCQUEUEDBNAME,1,{
//         upgrade(db) {
//             const store = db.createObjectStore(SYNCQUEUEDBNAME, {keyPath: 'id',autoIncrement: true,});
//             store.createIndex('generatedDate', 'generatedDate', { unique: false });
//         }
//     });
// }

export default VesselDisinfection;