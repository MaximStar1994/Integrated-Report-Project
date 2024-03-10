import Model from "./Model.js"
import { openDB } from 'idb';
import moment from 'moment-timezone';
import config from '../config/config';
var TIMEZONE = config.TIMEZONE;
const DBNAME = "dailyLog"
// const SYNCQUEUEDBNAME = "dailyLogQueued"
const SUBMITDBNAME = "dailyLogSubmitted"
class DailyLog extends Model {
    constructor() {
        super()
        this.timezone = TIMEZONE
    }
    CanViewDailyLogPage(backdatedValue,callback) {
        if (backdatedValue === "true") {
            return callback(true, null);
         }
        return new Promise(async (res, rej) => {
            var dailyLogLock = localStorage.getItem("DailyLogLock")
            if(JSON.parse(localStorage.getItem('user')).vessels.length<=0){
                callback(false, "No vessels attached to this account!")
            }
            else{
                var vesselID = JSON.parse(localStorage.getItem('selectedVessel'))?.vessel_id;
                var accountType = JSON.parse(localStorage.getItem('user')).accountType.toLowerCase();
                if (vesselID && accountType) {
                    super.postReq('/dailylog/available', { lock: dailyLogLock, vesselID: vesselID, accountType: accountType }, (value, error) => {
                        if (!error) {
                            if (value !== null) {
                                if (value.success === true) {
                                    localStorage.setItem("DailyLogLock", value.value)
                                }
                                localStorage.setItem("CanViewDailyLog", value.success)
                                callback(value.success, error)
                            } else {
                                localStorage.setItem("CanViewDailyLog", false)
                                callback(false, null)
                            }
                        } else {
                            callback(localStorage.getItem("CanViewDailyLog"), error)
                        }
                    })
                }
            }
        });
    }
    GetOpenDailyLogForToday(callback) {
        getOpenDailyLog((openDailyLogs) => {
            if(openDailyLogs===null){
                callback([]);
            }
            else{
                let timeStampToUse = moment.tz(new Date(), TIMEZONE);
                if(moment.tz(new Date(), TIMEZONE).isBefore(
                    moment.tz(new Date(), TIMEZONE).set('hour', 1).set('minute', 0).set('second', 0).set('millisecond', 0)
                )){
                    timeStampToUse.subtract(1, 'day');
                    console.log(timeStampToUse.format())
                }
                let vesselID = JSON.parse(localStorage.getItem('user')).vessels[0].vesselId;
                callback(openDailyLogs.filter(report=>report.reportDate===timeStampToUse.format('DD-MM-YYYY')&&report.vesselId===parseInt(vesselID)))
                // callback(openVesselReports.filter(report=>moment.tz(report.generatedDate, TIMEZONE).isSame(timeStampToUse, "day")&&report.vesselId===parseInt(vesselID)))
            }
        })
    }
    GetDailyLogStructure(callback) {
        return new Promise(async (res, rej) => {
            var vesselID = JSON.parse(localStorage.getItem('user')).vessels[0].vesselId;
            super.get('/dailylog/structure',{vesselID: vesselID}, (value,error) => {
                callback(value, error);
            })
        });
    }
    UnlockDailyLogPage(callback) {
        var dailyLogLock = localStorage.getItem("DailyLogLock")
        var vesselID = JSON.parse(localStorage.getItem('selectedVessel'))?.vessel_id;
        if(vesselID && dailyLogLock){
            return new Promise(async() => {
                const db = await getDailyLogDB();
                let dailyLogs = await db.getAll(DBNAME)
                if (dailyLogs.length === 0) {
                    super.postReq('/dailylog/unlock', { lock: dailyLogLock, vesselID: vesselID }, (value, error) => {
                            localStorage.removeItem("DailyLogLock");
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
    async ForceSyncDailyLog() {
        try{
            // await this.SyncVesselReports();
            return await this.ListDailyLog();
        }
        catch(e) {
            console.log("Force Sync Error: ", e);
        }

    }
    async SaveDailyLog(dailyLog, callback) {
        dailyLog.generatedDate = new Date()
        return await saveDailyLog(dailyLog)
    }
    async SubmitDailyLog (reportDate) {
        const db = await getDailyLogDB();
        let savedDailyLogs = await db.getAll(DBNAME)
        const logsToKeep = [];
        for(let i=0; i<savedDailyLogs.length; i++){
            if (savedDailyLogs[i].reportDate===reportDate) {
                await this.postDailyLog([savedDailyLogs[i]])
            }
            else{
                logsToKeep.push(savedDailyLogs[i]);
            }
        }
        await db.clear(DBNAME);
        await InsertSavedDailyLogs(logsToKeep,db)
        return 1
    }
    async CheckLocalDBForSubmission() {
        let vesselID = JSON.parse(localStorage.getItem('user')).vessels[0].vesselId;
        let timeStampToUse = moment.tz(new Date(), TIMEZONE);
        if(moment.tz(new Date(), TIMEZONE).isBefore(
            moment.tz(new Date(), TIMEZONE).set('hour', 1).set('minute', 0).set('second', 0).set('millisecond', 0)
        )){
            timeStampToUse.subtract(1, 'day');
        }
        let status = true;
        const submitteddb = await getDailyLogSubmittedDB();
        let submittedDailyLogs = await submitteddb.getAll(SUBMITDBNAME);
        if(submittedDailyLogs.length > 0) {
            if(submittedDailyLogs.filter(report=>report.reportDate===timeStampToUse.format('DD-MM-YYYY') && vesselID===report.vessel_id).length>0)
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
    ListDailyLog() {
        var vesselID = JSON.parse(localStorage.getItem('user')).vessels[0].vesselId;
        return new Promise(resolve => 
            super.get('/dailylog/list',{vesselID: vesselID}, async (value,error) => {
                if(!error){
                    var data = null
                    if (value !== null) {
                        if (value.success) {
                            data = value.value
                            await replaceSubmittedDailyLogs(data)
                        }
                    }
                    resolve(data);
                } else {
                    return new Promise(async() => {
                        const db = await getDailyLogSubmittedDB();
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
    
    async postDailyLog(log){
        const AuthStr = 'Bearer '.concat(localStorage.getItem("authenticationToken"));
            return new Promise((resolve ,reject) => 
                fetch(this.apiEndPoint + `/dailylog/sync`, {
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
                        const submittedDb = await getDailyLogSubmittedDB();
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
}
async function replaceSubmittedDailyLogs(logsToKeep) {
    const db = await getDailyLogSubmittedDB();
    if (logsToKeep instanceof Array) {
        await db.clear(SUBMITDBNAME)
        await InsertSubmittedDailyLogs(logsToKeep,db)
    }
    return "Ok"
}

async function saveDailyLog(log) {
    const db = await getDailyLogDB();
    var currentLogs = await db.getAll(DBNAME);
    var logGeneratedDate = moment.tz(log.generatedDate, TIMEZONE)
    var hasOldLog = false
    const tx = db.transaction(DBNAME, 'readwrite');
    await Promise.all([
        currentLogs.map(async oldlog => {
            let oldGeneratedDate = moment.tz(oldlog.generatedDate, TIMEZONE)
            if (oldlog.reportDate===log.reportDate) {
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

async function getOpenDailyLog(callback) {
    const db = await getDailyLogDB();
    var currentLogs = await db.getAll(DBNAME);
    if (currentLogs.length > 0) {
        callback(currentLogs)
    } else {
        callback(null)
    }
}

export async function getDailyLogDB() {
    return await openDB(DBNAME,1,{
        upgrade(db) {
            const store = db.createObjectStore(DBNAME, {keyPath: 'id',autoIncrement: true,});
            store.createIndex('dailyLogId', 'dailyLogId', { unique: false });
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

export async function getDailyLogSubmittedDB() {
    return await openDB(SUBMITDBNAME,1,{
        upgrade(db) {
            const store = db.createObjectStore(SUBMITDBNAME, {keyPath: 'id',autoIncrement: true,});
            store.createIndex('dailyLogId', 'dailyLogId', { unique: false });
            store.createIndex('generatedDate', 'generatedDate', { unique: false });
        }
    });
}

export async function InsertSavedDailyLogs(logs,db) {
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

export async function InsertSubmittedDailyLogs(logs,db) {
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

export default DailyLog;