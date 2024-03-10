import Model from "./Model.js"
import { openDB } from 'idb';
import moment from 'moment-timezone';
import config from '../config/config';
var TIMEZONE = config.TIMEZONE;
const DBNAME = "vesselReport"
// const SYNCQUEUEDBNAME = "vesselReportQueued"
const SUBMITDBNAME = "vesselReportSubmitted"
class VesselReport extends Model {
    constructor() {
        super()
        this.timezone = TIMEZONE
    }
    CanViewVesselReportPage(backdatedValue, callback) {
        if (backdatedValue === "true") {
           return callback(true, null);
        }
        return new Promise(async (res, rej) => {
            var vesselReportLock = localStorage.getItem("VesselReportLock")
            if(JSON.parse(localStorage.getItem('user')).vessels.length<=0){
                callback(false, "No vessels attached to this account!")
            }
            else{
                var vesselID = JSON.parse(localStorage.getItem('selectedVessel'))?.vessel_id;
                var accountType = JSON.parse(localStorage.getItem('user')).accountType.toLowerCase();
                if (vesselID && accountType) {
                    super.postReq('/vesselreport/available', { lock: vesselReportLock, vesselID: vesselID, accountType: accountType }, (value, error) => {
                        if (!error) {
                            if (value !== null) {
                                if (value.success === true) {
                                    localStorage.setItem("VesselReportLock", value.value)
                                }
                                localStorage.setItem("CanViewVesselReport", value.success)
                                callback(value.success, error)
                            } else {
                                localStorage.setItem("CanViewVesselReport", false)
                                callback(false, null)
                            }
                        } else {
                            callback(localStorage.getItem("CanViewVesselReport"), error)
                        }
                    })
                }
            }
        });
    }
    GetOpenVesselReportForToday(callback) {
        getOpenVesselReport((openVesselReports) => {
            if(openVesselReports===null){
                callback([]);
            }
            else{
                let timeStampToUse = moment.tz(new Date(), TIMEZONE);
                if(moment.tz(new Date(), TIMEZONE).isBefore(
                    moment.tz(new Date(), TIMEZONE).set('hour', 8).set('minute', 30).set('second', 0).set('millisecond', 0)
                )){
                    timeStampToUse.subtract(1, 'day');
                    console.log(timeStampToUse.format())
                }
                let vesselID = JSON.parse(localStorage.getItem('user')).vessels[0].vesselId;
                callback(openVesselReports.filter(report=>report.reportDate===timeStampToUse.format('DD-MM-YYYY')&&report.vesselId===parseInt(vesselID)))
                // callback(openVesselReports.filter(report=>moment.tz(report.generatedDate, TIMEZONE).isSame(timeStampToUse, "day")&&report.vesselId===parseInt(vesselID)))
            }
        })
    }
    GetVesselReportStructure(callback) {
        return new Promise(async (res, rej) => {
            var vesselID = JSON.parse(localStorage.getItem('user')).vessels[0].vesselId;
            super.get('/vesselreport/structure',{vesselID: vesselID}, (value,error) => {
                callback(value, error);
            })
        });
    }
    UnlockVesselReportPage(callback) {
        var vesselReportLock = localStorage.getItem("VesselReportLock")
        var vesselID = JSON.parse(localStorage.getItem('selectedVessel'))?.vessel_id;
        if(vesselID && vesselReportLock){
            return new Promise(async() => {
                const db = await getVesselReportDB();
                let vesselReports = await db.getAll(DBNAME)
                if (vesselReports.length === 0) {
                    super.postReq('/vesselreport/unlock', { lock: vesselReportLock, vesselID: vesselID }, (value, error) => {
                            localStorage.removeItem("VesselReportLock");
                    })
                } else {
                    callback(null,"There are vessel reports yet to be synced")
                }
            })
        }
        else{
            callback(null, "Vessel ID / Lock not found!");
        }
    }
    // async SyncVesselReports() {
    //     const db = await getVesselReportsQueueDB();
    //     let vesselReportsToSync = await db.getAll(SYNCQUEUEDBNAME)
    //     var oldestGenerated = null
    //     vesselReportsToSync.forEach(log => {
    //         if (oldestGenerated == null || moment(log.generatedDate).isAfter(oldestGenerated,'day')) {
    //             oldestGenerated = log.generatedDate
    //         }
    //     })
    //     const AuthStr = 'Bearer '.concat(localStorage.getItem("authenticationToken"));
    //     return new Promise((resolve ,reject) => 
    //         fetch(this.apiEndPoint + `/vesselreport/sync`, {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'Authorization': AuthStr
    //             },
    //             body: JSON.stringify({logs : vesselReportsToSync})
    //         }).then((response) => response.json())
    //             .then(async parsedJson => {
    //             if(parsedJson.success===true){
    //                 await db.clear(SYNCQUEUEDBNAME)
    //                 const submittedDb = await getVesselReportSubmittedDB();
    //                 const tx = submittedDb.transaction(SUBMITDBNAME, 'readwrite');
    //                 await Promise.all([
    //                     vesselReportsToSync.map(async log => {
    //                         await tx.store.add(log);
    //                         return log
    //                     })
    //                 ]);
    //                 await tx.done;
    //             }
    //             resolve(parsedJson);
    //         }).catch((err) => {
    //             console.log('Unable to Sync!!');
    //             reject(null);
    //         })    
    //     )
    // }
    async ForceSyncVesselReport() {
        try{
            // await this.SyncVesselReports();
            return await this.ListVesselReport();
        }
        catch(e) {
            console.log("Force Sync Error: ", e);
        }

    }
    async SaveVesselReport(vesselReport, callback) {
        vesselReport.generatedDate = new Date()
        return await saveVesselReport(vesselReport)
    }
    async SubmitVesselReport (reportDate, shift) {
        const db = await getVesselReportDB();
        let savedVesselReports = await db.getAll(DBNAME)
        const logsToKeep = [];
        for(let i=0; i<savedVesselReports.length; i++){
            if (savedVesselReports[i].reportDate===reportDate) {
                if(savedVesselReports[i].shift===shift){
                    await this.postVesselReport([savedVesselReports[i]])
                }
                else{
                    logsToKeep.push(savedVesselReports[i]);
                }
            }
        }
        await db.clear(DBNAME);
        await InsertSavedVesselReports(logsToKeep,db)
        return 1
    }
    async CheckLocalDBForSubmission(shift) {
        let vesselID = JSON.parse(localStorage.getItem('user')).vessels[0].vesselId;
        let timeStampToUse = moment.tz(new Date(), TIMEZONE);
        if(moment.tz(new Date(), TIMEZONE).isBefore(
            moment.tz(new Date(), TIMEZONE).set('hour', 8).set('minute', 30).set('second', 0).set('millisecond', 0)
        )){
            timeStampToUse.subtract(1, 'day');
        }
        let status = true;
        const submitteddb = await getVesselReportSubmittedDB();
        let submittedVesselReports = await submitteddb.getAll(SUBMITDBNAME);
        if(submittedVesselReports.length > 0) {
            if(submittedVesselReports.filter(report=>report.reportDate===timeStampToUse.format('DD-MM-YYYY') && report.shift===shift && vesselID===report.vessel_id).length>0)
                status=false;
        }
        // const vesselReportQueue = await getVesselReportsQueueDB();
        // let queuedLogs = await vesselReportQueue.getAll(SYNCQUEUEDBNAME)
        // if(queuedLogs.length > 0) {
        //     if(queuedLogs.filter(report=>report.reportDate===timeStampToUse.format('DD-MM-YYYY') && report.shift===shift).length>0) 
        //         status=false;
        // }
        return status;
    }
    ListVesselReport() {
        var vesselID = JSON.parse(localStorage.getItem('user')).vessels[0].vesselId;
        return new Promise(resolve => 
            super.get('/vesselreport/list',{vesselID: vesselID}, async (value,error) => {
                if(!error){
                    var data = null
                    if (value !== null) {
                        if (value.success) {
                            data = value.value
                            await replaceSubmittedVesselReports(data)
                        }
                    }
                    resolve(data);
                } else {
                    return new Promise(async() => {
                        const db = await getVesselReportSubmittedDB();
                        let logs = await db.getAll(SUBMITDBNAME)
                        resolve(logs);
                    })
                }
            })
        ) 
    }
    // async submitVesselReport(reportDate, shift) {
        // const db = await getVesselReportDB();
        // const logqueue = await getVesselReportsQueueDB();
        // let savedVesselReports = await db.getAll(DBNAME)
        // const tx = logqueue.transaction(SYNCQUEUEDBNAME, 'readwrite');
        // const logsToKeep = [];
        // for(let i=0; i<savedVesselReports.length; i++){
        //     if (savedVesselReports[i].reportDate===reportDate) {
        //         if(savedVesselReports[i].shift===shift){
        //             await this.postVesselReport(savedVesselReports[i])
        //         }
        //         else{
        //             logsToKeep.push(savedVesselReports[i]);
        //         }
        //     }
        // }
        // await db.clear(DBNAME);
        // await InsertSavedVesselReports(logsToKeep,db)
        // return 1
        // await Promise.all([
        //     savedVesselReports.forEach(async log => {
        //         if (log.reportDate===reportDate) {
        //             if(log.shift===shift){
        //                 await this.postVesselReport(log)
        //             }
        //             else{
        //                 logsToKeep.push(log);
        //             }
        //         }
        //         return log
        //     })
        // ]).then(async values=>{
        //     await db.clear(DBNAME);
        //     await InsertSavedVesselReports(logsToKeep,db)
        //     return 1
        // });
    // }
    
    async postVesselReport(log){
        const AuthStr = 'Bearer '.concat(localStorage.getItem("authenticationToken"));
            return new Promise((resolve ,reject) => 
                fetch(this.apiEndPoint + `/vesselreport/sync`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': AuthStr
                    },
                    body: JSON.stringify({logs : log})
                }).then((response) => response.json())
                    .then(async parsedJson => {
                    if(parsedJson.success===true){
                        const submittedDb = await getVesselReportSubmittedDB();
                        const tx = submittedDb.transaction(SUBMITDBNAME, 'readwrite');
                        await Promise.all([
                            await tx.store.add(log)
                        ]);
                        await tx.done;
                        resolve(parsedJson);
                    }
                    reject('Unable to submit!');
                }).catch((err) => {
                    console.log('Unable to Sync!!');
                    reject(err);
                })    
            )
    }

    getVesselReportFormStructure() {
        var vesselId = JSON.parse(localStorage.getItem('selectedVessel'))?.vessel_id;
        return new Promise((res, rej) => {
          super.get(
            "/vesselreport/export-vr-form-structure/list",
            {vesselId: vesselId},
            (value, error) => {
              if (!error) {
                if (value.success === true) {
                  res(value.value);
                } else {
                  rej("Unable to retrieve information!");
                }
              } else {
                rej("No internet!");
              }
            }
          );
        });
    }
    
    getVesselReportShiftLogFormStructure(shift) {
        var vesselId = JSON.parse(localStorage.getItem('selectedVessel'))?.vessel_id;
        return new Promise((res, rej) => {
          super.get(
            "/vesselreport/export-shift-log-form-structure/list",
            {vesselId: vesselId,shift: shift},
            (value, error) => {
              if (!error) {
                if (value.success === true) {
                  res(value.value);
                } else {
                  rej("Unable to retrieve information!");
                }
              } else {
                rej("No internet!");
              }
            }
          );
        });
      }
}
async function replaceSubmittedVesselReports(logsToKeep) {
    const db = await getVesselReportSubmittedDB();
    if (logsToKeep instanceof Array) {
        await db.clear(SUBMITDBNAME)
        await InsertSubmittedVesselReports(logsToKeep,db)
    }
    return "Ok"
}

async function saveVesselReport(log) {
    const db = await getVesselReportDB();
    var currentLogs = await db.getAll(DBNAME);
    var logGeneratedDate = moment.tz(log.generatedDate, TIMEZONE)
    var hasOldLog = false
    const tx = db.transaction(DBNAME, 'readwrite');
    await Promise.all([
        currentLogs.map(async oldlog => {
            let oldGeneratedDate = moment.tz(oldlog.generatedDate, TIMEZONE)
            if (oldlog.reportDate===log.reportDate && oldlog.shift===log.shift) {
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

async function getOpenVesselReport(callback) {
    const db = await getVesselReportDB();
    var currentLogs = await db.getAll(DBNAME);
    if (currentLogs.length > 0) {
        callback(currentLogs)
    } else {
        callback(null)
    }
}

export async function getVesselReportDB() {
    return await openDB(DBNAME,1,{
        upgrade(db) {
            const store = db.createObjectStore(DBNAME, {keyPath: 'id',autoIncrement: true,});
            store.createIndex('vesselReportId', 'vesselReportId', { unique: false });
            store.createIndex('generatedDate', 'generatedDate', { unique: false });
        }
    });
}

// export async function getVesselReportsQueueDB() {
//     return await openDB(SYNCQUEUEDBNAME,1,{
//         upgrade(db) {
//             const store = db.createObjectStore(SYNCQUEUEDBNAME, {keyPath: 'id',autoIncrement: true,});
//             store.createIndex('vesselReportId', 'vesselReportId', { unique: false });
//             store.createIndex('generatedDate', 'generatedDate', { unique: false });
//         }
//     });
// }

export async function getVesselReportSubmittedDB() {
    return await openDB(SUBMITDBNAME,1,{
        upgrade(db) {
            const store = db.createObjectStore(SUBMITDBNAME, {keyPath: 'id',autoIncrement: true,});
            store.createIndex('vesselReportId', 'vesselReportId', { unique: false });
            store.createIndex('generatedDate', 'generatedDate', { unique: false });
        }
    });
}

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

export async function InsertSubmittedVesselReports(logs,db) {
    const tx = db.transaction(SUBMITDBNAME, 'readwrite');
    await Promise.all([
        logs.map(async log => {
            delete log.id;
            await tx.store.add(log);
            return log
        })
    ]);
    await tx.done;
    return 1
}

export default VesselReport;