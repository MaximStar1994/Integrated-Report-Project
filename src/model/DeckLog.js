import Model from "./Model.js"
import { openDB } from 'idb';
import moment from 'moment-timezone';
var TIMEZONE = 'Asia/Singapore'
const DBNAME = "decklog"
const SYNCQUEUEDBNAME = "deckLogQueued"
const SUBMITDBNAME = "deckLogSubmitted"
class DeckLog extends Model {
    constructor() {
        super()
        this.timezone = TIMEZONE
    }
    CanViewDeckLogPage(callback) {
        var decklogLock = localStorage.getItem("DeckLogLock")
        super.postReq('/decklog/available',{lock : decklogLock}, (value,error) => {
            if(!error){
                var data = null
                if (value !== null) {
                    if (value.success) {
                        data = value.value
                        localStorage.setItem("DeckLogLock",data.lock)
                    }
                    localStorage.setItem("CanViewDeckLog",value.success)
                    callback(value.success, error)
                } else {
                    localStorage.setItem("CanViewDeckLog",false)
                    callback(false,null)
                }
            } else {
                callback(localStorage.getItem("CanViewDeckLog"),error)
            }
        })
    }
    UnlockDeckLogPage(callback) {
        var decklogLock = localStorage.getItem("DeckLogLock")
        return new Promise(async() => {
            const db = await getDeckLogDB();
            let deckLogs = await db.getAll(DBNAME)
            if (deckLogs.length == 0) {
                super.postReq('/decklog/unlock',{lock : decklogLock}, callback)
            } else {
                callback(null,"There are deck logs yet to be synced")
            }
        })
    }
    SyncDeckLogs() {
        return new Promise(async (resolve,reject) => {
            const db = await getDeckLogQueueDB();
            let decklogsToSync = await db.getAll(SYNCQUEUEDBNAME)
            var oldestGenerated = null
            decklogsToSync.forEach(log => {
                if (oldestGenerated == null || moment(log.generatedDate).isAfter(oldestGenerated,'day')) {
                    oldestGenerated = log.generatedDate
                }
            })
            const AuthStr = 'Bearer '.concat(localStorage.getItem("authenticationToken"));
            fetch(this.apiEndPoint + `/decklog/sync`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': AuthStr
                },
                body: JSON.stringify({logs : decklogsToSync})
            }).then((response) => {
                return response.json();
            }).then(async parsedJson => {
                await db.clear(SYNCQUEUEDBNAME)
                const submittedDb = await getDeckLogSubmittedDB();
                const tx = submittedDb.transaction(SUBMITDBNAME, 'readwrite');
                await Promise.all([
                    decklogsToSync.map(async log => {
                        await tx.store.add(log);
                        return log
                    })
                ]);
                await tx.done;
                resolve(parsedJson)
            }).catch((err) => {
                reject(err)
            })
        })
    }
    ForceSyncDeckLog(callback) {
        this.SyncDeckLogs()
        .then(rtnVal => {
            this.ListDeckLog(callback)
        }).catch(err => {
            console.log(err)
            this.ListDeckLog(callback)
        })
    }
    SaveDeckLogForToday(decklog, callback) {
        decklog.generatedDate = new Date()
        return new Promise(async() => {
            await SaveDeckLog(decklog)
            callback(decklog, null)
        })
    }
    SubmitDeckLogForToday(callback) {
        return new Promise(async (resolve,reject) => {
            await SubmitDeckLogsToday()
            this.SyncDeckLogs().then(val => {
                callback(val, null)
            }).catch(err => {
                navigator.serviceWorker.ready.then(function(swRegistration) {
                    return swRegistration.sync.register('syncDeckLogs');
                });
                callback(null, err)
            })
            resolve("done")
        })
    }
    CanSubmitDeckLog(callback) {
        var now = moment().tz(TIMEZONE)
        return new Promise(async() => {
            var canSubmit = true
            const submitteddb = await getDeckLogSubmittedDB();
            let submittedDeckLogs = await submitteddb.getAll(SUBMITDBNAME)
            if(submittedDeckLogs.length > 0) {
                var latestSubmitted = submittedDeckLogs[0]
                var latestDate = moment(latestSubmitted.generatedDate).tz(TIMEZONE);
                canSubmit = now.isAfter(latestDate,'day') && canSubmit
            }
            const decklogqueue = await getDeckLogQueueDB();
            let queuedLogs = await decklogqueue.getAll(SYNCQUEUEDBNAME)
            if(queuedLogs.length > 0) {
                var latestSubmitted = queuedLogs[0]
                var latestDate = moment(latestSubmitted.generatedDate).tz(TIMEZONE);
                canSubmit = now.isAfter(latestDate,'day') && canSubmit
            }
            callback(canSubmit)
        })
    }
    ListDeckLog(callback) {
        super.get('/decklog/list',null, (value,error) => {
            if(!error){
                var data = null
                if (value !== null) {
                    if (value.success) {
                        data = value.value
                        replaceSubmittedDeckLogs(data)
                    }
                }
                callback(data, error)
            } else {
                return new Promise(async() => {
                    const db = await getDeckLogSubmittedDB();
                    let logs = await db.getAll(SUBMITDBNAME)
                    callback(logs, null)
                })
            }
        })
    }
    async GetOpenDeckLog(callback) {
        const db = await getDeckLogDB();
        var currentLogs = await db.getAll(DBNAME);
        if (currentLogs.length > 0) {
            callback(currentLogs[currentLogs.length - 1])
        } else {
            callback(null)
        }
    }
}
async function replaceSubmittedDeckLogs(logsToKeep) {
    const db = await getDeckLogSubmittedDB();
    if (logsToKeep instanceof Array) {
        await db.clear(SUBMITDBNAME)
        await InsertDeckLogs(logsToKeep,db)
    }
    return "Ok"
}

async function SaveDeckLog(log) {
    const db = await getDeckLogDB();
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

async function SubmitDeckLogsToday() {
    const db = await getDeckLogDB();
    const logqueue = await getDeckLogQueueDB();
    let savedDeckLogs = await db.getAll(DBNAME)
    var now = moment().tz(TIMEZONE)
    const tx = logqueue.transaction(SYNCQUEUEDBNAME, 'readwrite');
    await Promise.all([
        savedDeckLogs.forEach(async log => {
            if (moment(log.generatedDate).isSame(now,'day')) {
                await tx.store.add(log)
            }
            return log
        })
    ]);
    await db.clear(DBNAME)
    return 1
}

export async function getDeckLogDB() {
    return await openDB(DBNAME,1,{
        upgrade(db) {
            const store = db.createObjectStore(DBNAME, {keyPath: 'id',autoIncrement: true,});
            store.createIndex('decklogId', 'decklogId', { unique: false });
            store.createIndex('generatedDate', 'generatedDate', { unique: false });
        }
    });
}

export async function getDeckLogQueueDB() {
    return await openDB(SYNCQUEUEDBNAME,1,{
        upgrade(db) {
            const store = db.createObjectStore(SYNCQUEUEDBNAME, {keyPath: 'id',autoIncrement: true,});
            store.createIndex('decklogId', 'decklogId', { unique: false });
            store.createIndex('generatedDate', 'generatedDate', { unique: false });
        }
    });
}

export async function getDeckLogSubmittedDB() {
    return await openDB(SUBMITDBNAME,1,{
        upgrade(db) {
            const store = db.createObjectStore(SUBMITDBNAME, {keyPath: 'id',autoIncrement: true,});
            store.createIndex('decklogId', 'decklogId', { unique: false });
            store.createIndex('generatedDate', 'generatedDate', { unique: false });
        }
    });
}

export async function InsertDeckLogs(logs,db) {
    const tx = db.transaction(SUBMITDBNAME, 'readwrite');
    await Promise.all([
        logs.map(async log => {
            await tx.store.add(log);
            return log
        })
    ]);
    await tx.done;
    return 1
}

export default DeckLog;