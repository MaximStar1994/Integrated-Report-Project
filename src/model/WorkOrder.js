import Model from "./Model.js"
import { openDB } from 'idb';
const woConfig = require('../workOrderConfig')
const getWoConfig = (id) => {
    return woConfig.workOrderConfig.find((val,idx) => {
        return val.id == id
    })
}
class WorkOrder extends Model {
    constructor() {
        super()
    }
    OfflineGetWorkOrderConfig(configId, callback) {
        fetch(this.apiEndPoint + `/workorder/config/${configId}`, {
            method : "GET"
        }).then((resp) => {
            return resp.json();
        }).then(parsedJson => {
            callback(parsedJson.value)
        })
    }
    OfflinePostWorkOrderLogs(woLogs,callback) {
        fetch(this.apiEndPoint + `/workorder`, {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({woLogs : woLogs})
        }).then((response) => {
            return response.json();
        }).then(parsedJson => {
            console.log(`post reply `,parsedJson)
            callback(parsedJson)
        })
    }
    OfflineListWorkOrderLogs(callback) {
        fetch(this.apiEndPoint + `/workorder/edge/log`, {
            method : "GET"
        }).then((resp) => {
            return resp.json();
        }).then(parsedJson => {
            callback(parsedJson.value)
        })
    }
    GetWorkOrderConfig(configId, callback) {
        super.get(`/workorder/config/${configId}`,null, (value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }

    PostWorkOrderLogs(woLogs, callback) {
        super.postReq('/workorder',{woLogs : woLogs}, (value,error) => {
            var data = null
            if (value !== null) {
                if (value.success) {
                    data = value.value
                }
            }
            callback(data, error)
        })
    }

    PostWorkOrderLogsForEdge(woLogs, callback) {
        var callbackFromOnline = navigator.onLine
        if (navigator.onLine) {
            super.postReq('/workorder',{woLogs : woLogs}, (value,error) => {
                var data = null
                if (value !== null) {
                    if (value.success) {
                        data = value.value
                    }
                }
                if (callbackFromOnline) {
                    callback(data, error)
                }
            })
        }
        return new Promise(async() => {
            await updateLogs(woLogs)
            if (callbackFromOnline) {
                callback(woLogs, null)
            }
        })
    }

    ListWorkOrderLogsForEdge(callback) {
        if (navigator.onLine==false) {
            super.get('/workorder/edge/log',null, (value,error) => {
                var data = null
                if (value !== null) {
                    if (value.success) {
                        data = value.value
                        replaceLogs(value.value)
                        data = this.ParseLogs(data)
                    }
                }
                callback(data, error)
            })
        } else {
            return new Promise(async() => {
                const db = await getDB();
                var logs = await db.getAll('workOrderLog')
                logs = this.ParseLogs(logs)
                callback(logs,null)
            })
        }
    }

    ParseLogs(logs) {
        logs.map(log => {
            var config = getWoConfig(log.workOrderConfigId)
            if (config != undefined) {
                log.workOrderNo = log.dbId
                log.equipment = config.equipment
                log.workOrderType = config.workOrderType
                log.scheduledDate = new Date(log.creationDate)
            }
            return log
        })
        return logs
    }
}

async function replaceLogs(logsToKeep) {
    const db = await getDB();
    if (logsToKeep instanceof Array) {
        await db.clear('workOrderLog')
        await InsertLogs(logsToKeep,db)
    }
    return "Ok"
}

async function updateLogs(logs) {
    const db = await getDB();
    await Promise.all(logs.map(async (log) => {
        if (log.dbId !== null && log.dbId !== undefined) {
            let dbIdKeyRange = IDBKeyRange.only(log.dbId);
            const currentLogs = await db.getAllFromIndex('workOrderLog','dbId',dbIdKeyRange);
            const tx = db.transaction('workOrderLog', 'readwrite');
            if (currentLogs.length > 0) {
                log.id = currentLogs[0].id
                await tx.store.put(log, log.id)
            } else {
                await tx.store.add(log)
            }
        }
        return 1
    }))
    return "Ok"
}

export async function getDB() {
    return await openDB("offlineDB",1,{
        upgrade(db) {
            const store = db.createObjectStore('workOrderLog', {keyPath: 'id',autoIncrement: true,});
            store.createIndex('dbId', 'dbId', { unique: false });
            store.createIndex('workOrderConfigId', 'workOrderConfigId', { unique: false });
            store.createIndex('creationDate', 'creationDate', { unique: false });
            store.createIndex('updateDate', 'updateDate', { unique: false });
            store.createIndex('status', 'status', { unique: false });
            store.createIndex('action', 'action', { unique: false });
        }
    });
}
export async function InsertLogs(logs,db) {
    const tx = db.transaction('workOrderLog', 'readwrite');
    await Promise.all([
        logs.map(async log => {
            log.updateDate = new Date(log.updateDate)
            log.creationDate = new Date(log.creationDate)
            await tx.store.add(log);
            return log
        })
    ]);
    await tx.done;
    return 1
}

export default WorkOrder;