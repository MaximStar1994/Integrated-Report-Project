import Model from "./Model.js"
import { openDB } from 'idb';
import moment from 'moment-timezone';
import config from '../config/config';
var TIMEZONE = config.TIMEZONE;
const DBNAME = "crewTemperatureReport"
// const SYNCQUEUEDBNAME = "crewTemperatureQueued"

const IsEmpty = val => val == undefined || val == null || val.toString() == '';

class CrewTemperatureReport extends Model {
    constructor() {
        super()
        this.timezone = TIMEZONE
    }
    async CheckSubmissionForToday(){
        var vesselID = JSON.parse(localStorage.getItem('user'))?.vessels[0]?.vesselId;
        return new Promise(async(resolve, reject) => {
            super.get('/crewtemperaturereport/checksubmissionfortoday',{vesselId: vesselID}, async(value, error) => {
                if(!error){
                    console.log(value);
                    resolve(value.value);
                } else {
                    // const db = await getCrewTemperatureQueueDB();
                    // let crewTemperatureReportsToSync = await db.getAll(SYNCQUEUEDBNAME);
                    // if(crewTemperatureReportsToSync instanceof Array && crewTemperatureReportsToSync.length>0){
                    //     crewTemperatureReportsToSync.forEach(log => {
                    //         console.log(moment(log.dateSubmitted).format('DD-MM-YYYY'));
                    //         if (IsEmpty(log.dateSubmitted)===false && moment(log.dateSubmitted).format('DD-MM-YYYY')===moment(new Date()).format('DD-MM-YYYY')) {
                    //             resolve(true);
                    //         }
                    //     })
                    // }
                    // console.log(crewTemperatureReportsToSync);

                    let temp = await this.GetOpenCrewTemperatureReportForToday();
                    if(temp instanceof Array && temp.length>0){
                        resolve(false);
                    }
                    reject(error);
                }

            })
        })
    }
    CanViewCrewTemperaturePage(callback) {
        return new Promise(async (res, rej) => {
            var crewTemperatureLock = localStorage.getItem("CrewTemperatureLock")
            if(JSON.parse(localStorage.getItem('user')).vessels.length<=0){
                callback(false, "No vessels attached to this account!")
            }
            else{
                var vesselID = JSON.parse(localStorage.getItem('selectedVessel'))?.vessel_id;
                var accountType = JSON.parse(localStorage.getItem('user')).accountType.toLowerCase();
                if (vesselID && accountType) {
                    super.postReq('/crewtemperaturereport/available', { lock: crewTemperatureLock, vesselID: vesselID, accountType: accountType }, (value, error) => {
                        if (!error) {
                            if (value !== null) {
                                if (value.success === true) {
                                    localStorage.setItem("CrewTemperatureLock", value.value)
                                }
                                localStorage.setItem("CanViewTemperatureReport", value.success)
                                callback(value.success, error)
                            } else {
                                localStorage.setItem("CanViewTemperatureReport", false)
                                callback(false, null)
                            }
                        } else {
                            if (localStorage.getItem("CanViewTemperatureReport") === true || localStorage.getItem("CanViewTemperatureReport") === 'true') {
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
    UnlockCrewTemperatureReport(callback) {
        var crewTemperatureLock = localStorage.getItem("CrewTemperatureLock")
        var vesselID = JSON.parse(localStorage.getItem('selectedVessel'))?.vessel_id;
        if(vesselID && crewTemperatureLock){
            return new Promise(async() => {
                const db = await getCrewTemperatureReportDB();
                let crewTemperatureReports = await db.getAll(DBNAME)
                if (crewTemperatureReports.length === 0) {
                    super.postReq('/crewtemperaturereport/unlock',{lock : crewTemperatureLock, vesselID: vesselID}, callback)
                } else {
                    callback(null,"There are vessel reports yet to be synced")
                }
            })
        }
        else{
            callback(null, "Vessel ID / Lock not found!");
        }
    }
    GetVesselData() {
        var vesselID = JSON.parse(localStorage.getItem('user'))?.vessels[0]?.vesselId;
        return new Promise(async(resolve, reject) => {
            super.get('/crewtemperaturereport/vesseldata',{vesselId: vesselID}, (value, error) => {
                if(!error){
                    console.log(value);
                    resolve(value.value);
                } else {
                    reject(error);
                }

            })
        })
    }
    GetOpenCrewTemperatureReportForToday() {
        return new Promise((response, reject) => {
            getOpenCrewTemperatureReport((openVesselReports) => {
                if(openVesselReports===null){
                    response([]);
                }
                else{
                    let vesselID = JSON.parse(localStorage.getItem('user')).vessels[0].vesselId;
                    response(openVesselReports.filter(report=>moment.tz(report.generatedDate, TIMEZONE).isSame(moment.tz(new Date(), TIMEZONE), "day")&&report.vesselId===parseInt(vesselID)))
                }
            })
        });
    }
    async PostCrewTemperatureReport(log) {
        const AuthStr = 'Bearer '.concat(localStorage.getItem("authenticationToken"));
        return new Promise((resolve, reject) => 
            fetch(this.apiEndPoint + `/crewtemperaturereport/sync`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': AuthStr
                },
                body: JSON.stringify({logs : [log]})
            }).then((response) => response.json())
                .then(async parsedJson => {
                resolve(parsedJson);
            }).catch((err) => {
                console.log('Unable to Sync!!');
                reject(err);
            })    
        )
    }
    // async ForceSyncCrewTemperatureReport() {
    //     try{
    //         return await this.SyncCrewTemperatureReport();
    //     }
    //     catch(e) {
    //         console.log("Force Sync Error: ", e);
    //     }

    // }
    async SaveCrewTemperatureReport(vesselReport) {
        vesselReport.generatedDate = new Date()
        return await saveCrewTemperatureReport(vesselReport)
    }
    async SubmitCrewTemperatureReport (dateSubmitted) {
        const db = await getCrewTemperatureReportDB();
        let savedVesselReports = await db.getAll(DBNAME);
        for(let i=0; i<savedVesselReports.length;i++){
            if (IsEmpty(savedVesselReports[i].dateSubmitted)===false && IsEmpty(dateSubmitted)===false && moment(savedVesselReports[i].dateSubmitted).format('DD-MM-YYYY')===moment(dateSubmitted).format('DD-MM-YYYY')) {
                    await this.PostCrewTemperatureReport(savedVesselReports[i])
            }
        }
        await db.clear(DBNAME);
        return 1
    }
}

async function saveCrewTemperatureReport(log) {
    const db = await getCrewTemperatureReportDB();
    var currentLogs = await db.getAll(DBNAME);
    var logGeneratedDate = moment.tz(log.generatedDate, TIMEZONE)
    var hasOldLog = false
    const tx = db.transaction(DBNAME, 'readwrite');
    await Promise.all([
        currentLogs.map(async oldlog => {
            let oldGeneratedDate = moment.tz(oldlog.generatedDate, TIMEZONE)
            if (oldGeneratedDate.isSame(logGeneratedDate,"day")) {
                log.id = oldlog.id
                hasOldLog = true
                await tx.store.put(log)
            }
        })
    ])
    if (!hasOldLog) {
        await tx.store.add(log)
    }
    return await tx.done;
}

async function getOpenCrewTemperatureReport(callback) {
    const db = await getCrewTemperatureReportDB();
    var currentLogs = await db.getAll(DBNAME);
    if (currentLogs.length > 0) {
        callback(currentLogs)
    } else {
        callback(null)
    }
}

// async function submitCrewTemperatureReport(dateSubmitted) {
//     const db = await getCrewTemperatureReportDB();
//     const logqueue = await getCrewTemperatureQueueDB();
//     let savedVesselReports = await db.getAll(DBNAME);
//     const tx = logqueue.transaction(SYNCQUEUEDBNAME, 'readwrite');
//     // const logsToKeep = [];
//     await Promise.all([
//         savedVesselReports.forEach(async log => {
            
//             console.log(IsEmpty(log.dateSubmitted), moment(log.dateSubmitted).format('DD-MM-YYYY'), moment(dateSubmitted).format('DD-MM-YYYY'));
//             if (IsEmpty(log.dateSubmitted)===false && IsEmpty(dateSubmitted)===false && moment(log.dateSubmitted).format('DD-MM-YYYY')===moment(dateSubmitted).format('DD-MM-YYYY')) {
//                     await tx.store.add(log)
//             }
//             else{
//                 // logsToKeep.push(log);
//             }
//             return log
//         })
//     ]);
//     await db.clear(DBNAME);
//     // await InsertSavedVesselReports(logsToKeep,db)
//     return 1
// }

export async function getCrewTemperatureReportDB() {
    return await openDB(DBNAME,1,{
        upgrade(db) {
            const store = db.createObjectStore(DBNAME, {keyPath: 'id',autoIncrement: true,});
            store.createIndex('crewTemperatureReportId', 'crewTemperatureReportId', { unique: false });
            store.createIndex('generatedDate', 'generatedDate', { unique: false });
        }
    });
}

// export async function getCrewTemperatureQueueDB() {
//     return await openDB(SYNCQUEUEDBNAME,1,{
//         upgrade(db) {
//             const store = db.createObjectStore(SYNCQUEUEDBNAME, {keyPath: 'id',autoIncrement: true,});
//             store.createIndex('crewTemperatureReportId', 'crewTemperatureReportId', { unique: false });
//             store.createIndex('generatedDate', 'generatedDate', { unique: false });
//         }
//     });
// }

export async function InsertSavedVesselReports(logs,db) {
    const tx = db.transaction(DBNAME, 'readwrite');
    await Promise.all([
        logs.map(async log => {
            await tx.store.add(log);
            return log
        })
    ]);
    await tx.done;
    return 1
}

export default CrewTemperatureReport;