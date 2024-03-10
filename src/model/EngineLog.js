import Model from "./Model.js"
import { openDB } from 'idb';
import moment from 'moment-timezone';
var TIMEZONE = 'Asia/Singapore'
const DBNAME = "engineLog"
const SUBMITDBNAME = "engineLogSubmitted"
class EngineLog extends Model {
    constructor() {
        super()
        this.timezone = TIMEZONE
    }
    CanViewEngineLogPage(callback) {
        var elogLock = localStorage.getItem("EngineLogLock")
        super.postReq('/enginelog/available',{lock : elogLock}, (value,error) => {
            if(!error){
                var data = null
                if (value !== null) {
                    if (value.success) {
                        data = value.value
                        localStorage.setItem("EngineLogLock",data.lock)
                    }
                    localStorage.setItem("CanViewElog",value.success)
                    callback(value.success, error)
                } else {
                    localStorage.setItem("CanViewElog",false)
                    callback(false,null)
                }
            } else {
                callback(localStorage.getItem("CanViewElog"),error)
            }
        })
    }
    UnlockEngineLogPage(callback) {
        var elogLock = localStorage.getItem("EngineLogLock")
        return new Promise(async() => {
            const db = await getEngineLogDB();
            let engineLogs = await db.getAll(DBNAME)
            if (engineLogs.length == 0) {
                super.postReq('/enginelog/unlock',{lock : elogLock}, callback)
            } else {
                callback(null,"There are elogs yet to be synced")
            }
        })
    }
    SyncEngineLog() {
        return new Promise(async (resolve,reject) => {
            const db = await getEngineLogSubmittedDB();
            let engineLogs = await db.getAll(SUBMITDBNAME)
            var oldestGenerated = null
            engineLogs.forEach(log => {
                if (oldestGenerated == null || moment(log.generatedDate).isAfter(oldestGenerated,'day')) {
                    oldestGenerated = log.generatedDate
                }
            })
            engineLogs = engineLogs.filter(log => log.timeInterval != undefined)
            const AuthStr = 'Bearer '.concat(localStorage.getItem("authenticationToken"));
            fetch(this.apiEndPoint + `/enginelog/sync`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': AuthStr
                },
                body: JSON.stringify({logs : engineLogs})
            }).then((response) => {
                return response.json();
            }).then(async parsedJson => {
                await db.clear(SUBMITDBNAME)
                const tx = db.transaction(SUBMITDBNAME, 'readwrite');
                if (oldestGenerated != null) {
                    await tx.store.add({generatedDate : oldestGenerated})
                }
                resolve(parsedJson)
                return 1
            }).catch((err) => {
                reject(err)
            })
        })
    }
    ForceSyncEngineLog(callback) {
        this.SyncEngineLog()
        .then(rtnVal => {
            this.ListEngineLog(callback)
        }).catch(err => {
            console.log(err)
            this.ListEngineLog(callback)
        })
    }
    SaveEngineLogForToday(engineLog, callback) {
        engineLog.updateDate = new Date()
        return new Promise(async() => {
            await updateLogs([engineLog])
            callback(engineLog, null)
        })
    }
    SubmitEngineLogForToday(callback) {
        return new Promise(async (resolve,reject) => {
            await submitEngineLogsToday()
            this.SyncEngineLog().then(val => {
                callback(val, null)
            }).catch(err => {
                navigator.serviceWorker.ready.then(function(swRegistration) {
                    return swRegistration.sync.register('syncEngineLogs');
                });
                callback(null, err)
            })
            resolve("done")
        })
    }
    CanSubmitEngineLog(callback) {
        var now = moment().tz(TIMEZONE)
        this.ListPastEngineLog((pastLog) => {
            if (pastLog.length > 0) {
                var latestLog = pastLog[0]
                var latestDate = moment(latestLog.generated_date).tz(TIMEZONE)
                callback(now.isAfter(latestDate,'day'))
            } else {
                return new Promise(async (resolve,reject) => {
                    const db = await getEngineLogSubmittedDB();
                    let engineLogs = await db.getAll(SUBMITDBNAME)
                    var oldestGenerated = null
                    engineLogs.forEach(log => {
                        if (oldestGenerated == null || moment(log.generatedDate).isAfter(oldestGenerated,'day')) {
                            oldestGenerated = log.generatedDate
                        }
                    })
                    if (oldestGenerated == null) {
                        callback(true)
                    } else {
                        oldestGenerated = moment(oldestGenerated).tz(TIMEZONE)
                        callback(now.isAfter(oldestGenerated,'day'))
                    }
                    resolve("done")
                })
            }
        })
    }

    PostEngineLog(engineLog, callback) {
        engineLog.updateDate = new Date()
        super.postReq('/enginelog',{log : engineLog}, (value,error) => {
            if(!error){
                var data = null
                if (value !== null) {
                    if (value.success) {
                        data = value.value
                    }
                }
                this.SyncEngineLog().then(val => {
                    callback(data, error)
                })
            } else {
                return new Promise(async() => {
                    await updateLogs([engineLog])
                    navigator.serviceWorker.ready.then(function(swRegistration) {
                        return swRegistration.sync.register('syncEngineLogs');
                    });
                    callback(engineLog, null)
                })
            }
        })
    }
    ListEngineLog(callback) {
        return new Promise(async() => {
            const db = await getEngineLogDB();
            let engineLogs = await db.getAll(DBNAME)
            callback(engineLogs, null)
        })
    }
    ListPastEngineLog(callback) {
        super.get('/enginelog/list',null, (value,error) => {
            if(!error){
                var data = null
                if (value !== null) {
                    if (value.success) {
                        data = value.value
                    }
                }
                callback(data, error)
            } else {
                callback([],error)
            }
        })
    }
    AutoFill(callback) {
        super.get('/enginelog/data',null, (value,error) => {
            callback(value, error);
        })
    }
}

async function replaceEngineLogs(logsToKeep) {
    const db = await getEngineLogDB();
    if (logsToKeep instanceof Array) {
        await db.clear(DBNAME)
        await InsertEngineLogs(logsToKeep,db)
    }
    return "Ok"
}

async function updateLogs(logs) {
    const db = await getEngineLogDB();
    var currentLogs = await db.getAll(DBNAME);
    var now = moment().tz(TIMEZONE)

    logs.map((log) => {
        log.generatedDate = moment().tz(TIMEZONE).format();
        log.updateDate = moment().format();
        var similarLogIdx = currentLogs.findIndex(dblog => dblog.timeInterval == log.timeInterval)
        if (similarLogIdx == -1) {
            currentLogs.push(log)
        } else {
            currentLogs[similarLogIdx] = log
        }
    })
    currentLogs = currentLogs.filter(curLog => {
        return moment(curLog.generatedDate).tz(TIMEZONE).dayOfYear() == now.dayOfYear()
    })
    currentLogs.map(curLog => {
        curLog.generatedDate = moment().tz(TIMEZONE).format();
    })
    await replaceEngineLogs(currentLogs)
    return "Ok"
}

export async function getEngineLogDB() {
    return await openDB(DBNAME,1,{
        upgrade(db) {
            const store = db.createObjectStore(DBNAME, {keyPath: 'id',autoIncrement: true,});
            store.createIndex('elogId', 'elogId', { unique: false });
            store.createIndex('updateDate', 'updateDate', { unique: false });
        }
    });
}

export async function getEngineLogSubmittedDB() {
    return await openDB(SUBMITDBNAME,1,{
        upgrade(db) {
            const store = db.createObjectStore(SUBMITDBNAME, {keyPath: 'id',autoIncrement: true,});
            store.createIndex('elogId', 'elogId', { unique: false });
            store.createIndex('updateDate', 'updateDate', { unique: false });
        }
    });
}

async function submitEngineLogsToday() {
    const db = await getEngineLogDB();
    const submittedDB = await getEngineLogSubmittedDB();
    let engineLogs = await db.getAll(DBNAME)
    var now = moment()
    const tx = submittedDB.transaction(SUBMITDBNAME, 'readwrite');
    await Promise.all([
        engineLogs.forEach(async log => {
            if (moment(log.generatedDate).isSame(now,'day')) {
                await tx.store.add(log)
            }
            return log
        })
    ]);
    db.clear(DBNAME)
    return 1
}

export async function InsertEngineLogs(logs,db) {
    const tx = db.transaction(DBNAME, 'readwrite');
    await Promise.all([
        logs.map(async log => {
            log.updateDate = new Date(log.updateDate)
            await tx.store.add(log);
            return log
        })
    ]);
    await tx.done;
    return 1
}

export default EngineLog;