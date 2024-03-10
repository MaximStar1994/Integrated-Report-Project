import Model from "./Model.js"
import { openDB } from 'idb';
import { dateTimePickerDefaultProps } from "@material-ui/pickers/constants/prop-types";
const OPENLOGDBNAME = "bdnOpen"
const DBNAME = "bdnSaved"
const calorificFactors = [
    {methane : 892.92, ethane : 1564.35, propane : 2224.03, iButane : 2874.21, nButane : 2883.35, iPentane : 3536.01, nPentane : 3542.91, nHexane : 4203.24, nitrogen : 0, oxygen : 0, carbonDioxide : 0 },
    {methane : 891.51, ethane : 1562.14, propane : 2221.10, iButane : 2870.58, nButane : 2879.76, iPentane : 3531.68, nPentane : 3538.60, nHexane : 4198.24, nitrogen : 0, oxygen : 0, carbonDioxide : 0 },
    {methane : 891.46, ethane : 1562.06, propane : 2220.99, iButane : 2870.45, nButane : 2879.63, iPentane : 3531.52, nPentane : 3538.45, nHexane : 4198.06, nitrogen : 0, oxygen : 0, carbonDioxide : 0 },
    {methane : 891.05, ethane : 1561.42, propane : 2220.13, iButane : 2869.39, nButane : 2878.58, iPentane : 3530.25, nPentane : 3537.19, nHexane : 4196.60, nitrogen : 0, oxygen : 0, carbonDioxide : 0 },
    {methane : 890.58, ethane : 1560.69, propane : 2219.17, iButane : 2868.20, nButane : 2877.40, iPentane : 3528.83, nPentane : 3535.77, nHexane : 4194.95, nitrogen : 0, oxygen : 0, carbonDioxide : 0 },
]
const summationFactors = [
    {methane : 0.04886, ethane : 0.0997, propane : 0.1465, iButane : 0.1885, nButane : 0.2022, iPentane : 0.2458, nPentane : 0.2586, nHexane : 0.3319, nitrogen : 0.0214, oxygen : 0.0311, carbonDioxide : 0.0821 },
    {methane : 0.04452, ethane : 0.0919, propane : 0.1344, iButane : 0.1722, nButane : 0.184, iPentane : 0.2251, nPentane : 0.2361, nHexane : 0.3001, nitrogen : 0.017, oxygen : 0.0276, carbonDioxide : 0.0752 },
    {methane : 0.04437, ethane : 0.0916, propane : 0.134, iButane : 0.1717, nButane : 0.1834, iPentane : 0.2244, nPentane : 0.2354, nHexane : 0.299, nitrogen : 0.0169, oxygen : 0.0275, carbonDioxide : 0.0749 },
    {methane : 0.04317, ethane : 0.0895, propane : 0.1308, iButane : 0.1673, nButane : 0.1785, iPentane : 0.2189, nPentane : 0.2295, nHexane : 0.2907, nitrogen : 0.0156, oxygen : 0.0265, carbonDioxide : 0.073 },
    {methane : 0.04317, ethane : 0.0895, propane : 0.1308, iButane : 0.1673, nButane : 0.1785, iPentane : 0.2189, nPentane : 0.2295, nHexane : 0.2907, nitrogen : 0.0156, oxygen : 0.0265, carbonDioxide : 0.073 },
]
const CombustionCoeff = {
    null : null,
    1: 45.064,
    2: 44.431,
    3: 44.408,
    4: 44.222,
    5: 44.013,
}
const CombstionIDToTemp = {
    null: null,
    1: 0,
    2 : 15,
    3 : 15.5,
    4 : 20,
    5 : 25 
}
const CombstionTempToID = {
    '': null,
    '0': 1,
    '15': 2,
    '15.5': 3,
    '20': 4,
    '25': 5 
}
class BunkerDeliveryNote extends Model {
    constructor() {
        super()
    }
    CanViewBDNPage(callback) {
        var bdnLock = localStorage.getItem("BDNLock")
        super.postReq('/bunkerdeliverynote/available',{lock : bdnLock}, (value,error) => {
            if(!error){
                var data = null
                if (value !== null) {
                    if (value.success) {
                        data = value.value
                        localStorage.setItem("BDNLock",data.lock)
                    }
                    localStorage.setItem("CanViewBDN",value.success)
                    callback(value.success, error)
                } else {
                    localStorage.setItem("CanViewBDN",false)
                    callback(false,null)
                }
            } else {
                callback(localStorage.getItem("CanViewBDN"),error)
            }
        })
    }
    UnlockBDNPage(callback) {
        var bdnLock = localStorage.getItem("BDNLock")
        return new Promise(async() => {
            const db = await getOpenBDNDB()
            const currentOpenBDNs = await db.getAll(OPENLOGDBNAME)
            if (currentOpenBDNs.length == 0) {
                super.postReq('/bunkerdeliverynote/unlock',{lock : bdnLock}, callback)
            } else {
                callback(false,"There are open bdns yet to be synced")
            }
        })
    }
    ListBunkerDeliveryNoteData(callback) {
        super.get(`/bunkerdeliverynote/`,null, async (value,error) => {
            if(!error){
                var data = null
                if (value !== null) {
                    if (value.success) {
                        data = value.value
                        // const db = await getSavedBDNDB();
                        // await PostSavedBDN(data,db)
                    }
                }
                callback(data, true, error)
            }
            else{
                console.log('Offline');
                return new Promise(async() => {
                    const db = await getSavedBDNDB();
                    let bdns = await db.getAll(DBNAME)
                    callback(bdns, false, null)
                })
            }
        })
    }
    GetBunkerDeliveryNoteData(data, callback) {
        if (navigator.onLine) {
            super.get(`/bunkerdeliverynote/${data}/data`,null, (value,error) => {
                var data = null
                if (value !== null) {
                    if (value.success) {
                        data = value.value
                        delete data.volume
                        delete data.netEnergy
                    }
                }
                callback(data, error)
            })
        } else {
            callback({},"No internet")
        }
    }
    GetBunkerDeliveryNoteDataAfterTransfer(data, callback) {
        if (navigator.onLine) {
            super.get(`/bunkerdeliverynote/${data}/data`,null, (value,error) => {
                var data = null
                if (value !== null) {
                    if (value.success) {
                        var rtnData = value.value
                        data = this.Calculate(rtnData)
                        console.log(data)
                    }
                }
                callback({
                    volume : data.volume,
                    // netEnergyMMbtu : data.netEnergy,
                    // netEnergyMWh : data.netEnergy,
                    // gasConsumed : data.gasConsumed,
                    // mass : data.mass,
                    // grossEnergy : data.grossEnergy,
                    // vaporDisplaced : data.vaporDisplaced,
                }, error)
            })
        } else {
            callback({},"No internet")
        }
    }
    CreateBunkerDeliveryNoteData(callback) {
        return new Promise(async() => {
            var openBDN = {}
            var newBDN = await SaveOpenBDN(openBDN)
            callback(newBDN, null)
        })
    }
    GetOpenBDN(callback) {
        return new Promise(async() => {
            const db = await getOpenBDNDB();
            const currentOpenBDN = await db.getAll(OPENLOGDBNAME);
            callback(currentOpenBDN[0], null)
        })
    }
    //save button
    UpdateBunkerDeliveryNoteData(bdnNo, data, callback) {
        data.reportId = bdnNo
        return new Promise(async() => {
            var saveData = this.Calculate(data, false)
            var newBDN = await SaveOpenBDN(saveData)
            callback(newBDN, null)
        })
    }
    // submit button
    GenerateBunkerDeliveryNote(bdnNo, data, callback) {
        return new Promise(async() => {
            data.reportId = bdnNo
            const db = await getOpenBDNDB();
            const currentOpenBDNs = await db.getAll(OPENLOGDBNAME);
            var currentOpenBDN = currentOpenBDNs[0] || {}
            var saveData = this.Calculate(data, false)
            Object.assign(currentOpenBDN,saveData)
            await SubmitBDN(currentOpenBDN)
            navigator.serviceWorker.ready.then(function(swRegistration) {
                return swRegistration.sync.register('syncBDN');
            });
            try {
                await this.SyncBDN()
                callback({reportId : bdnNo}, null)
            } catch (err) {
                callback({reportId : bdnNo}, null)
            }
        })
    }
    SyncBDN() {
        return new Promise(async (resolve,reject) => {
            const db = await getSavedBDNDB();
            let bdns = await db.getAll(DBNAME)
            const AuthStr = 'Bearer '.concat(localStorage.getItem("authenticationToken"));
            fetch(this.apiEndPoint + `/bunkerdeliverynote/sync`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': AuthStr
                },
                body: JSON.stringify({notes : bdns})
            }).then((response) => {
                return response.json();
            }).then(async parsedJson => {
                if (parsedJson.value instanceof Array) {
                    await replaceSavedBDN(parsedJson.value )
                }
                resolve(parsedJson)
            }).catch((err) => {
                reject(err)
            })
        })
    }
    Calculate(data, shouldOverwrite = true) {
        var methane = data.methane
        var ethane = data.ethane
        var propane = data.propane
        var isoButane = data.isoButane
        var nButane = data.nButane
        var isoPentane = data.isoPentane
        var nPentane = data.nPentane
        var nHexane = data.nHexane
        var nitrogen = data.nitrogen
        var oxygen = data.oxygen || 0
        var carbonDioxide = data.carbonDioxide || 0
        var combustionTempCoeff = CombustionCoeff[data.combustionTemperatureId]
        var combustionTempDeg = CombstionIDToTemp[data.combustionTemperatureId]
        if (data.combustionTemperatureId == undefined || data.combustionTemperatureId == null) {
            return data
        }
        var combustionTempId = data.combustionTemperatureId - 1
        var M = (methane * 16.04246) + (ethane * 30.06904) + (propane * 44.09562) + (isoButane * 58.1222) + (nButane * 58.1222) + (isoPentane * 72.14878) + (nPentane * 72.14878) + (nHexane * 86.17536) + (nitrogen * 28.0134) + (oxygen * 31.9988) + (carbonDioxide * 44.0095)
        var s = (methane * summationFactors[combustionTempId].methane) + (ethane * summationFactors[combustionTempId].ethane) + (propane * summationFactors[combustionTempId].propane) + (isoButane * summationFactors[combustionTempId].iButane) + (nButane * summationFactors[combustionTempId].nButane) + (isoPentane * summationFactors[combustionTempId].iPentane) + (nPentane * summationFactors[combustionTempId].nPentane) + (nHexane * summationFactors[combustionTempId].nHexane) + (nitrogen * summationFactors[combustionTempId].nitrogen) + (oxygen * summationFactors[combustionTempId].oxygen) + (carbonDioxide * summationFactors[combustionTempId].carbonDioxide)
        var z = 1 - s**2
        var rTP = 8.3144621* (combustionTempId == (3 - 1) ? (273.15+15+(5/9)) : combustionTempDeg + 273.15)/101.325/1000
        var HcG = (methane * calorificFactors[combustionTempId].methane) + (ethane * calorificFactors[combustionTempId].ethane) + (propane * calorificFactors[combustionTempId].propane) + (isoButane * calorificFactors[combustionTempId].iButane) + (nButane * calorificFactors[combustionTempId].nButane) + (isoPentane * calorificFactors[combustionTempId].iPentane) + (nPentane * calorificFactors[combustionTempId].nPentane) + (nHexane * calorificFactors[combustionTempId].nHexane) + (nitrogen * 0) + (oxygen * 0) + (carbonDioxide * 0)
        var HyrdogenNumber = (methane * 4) + (ethane * 6) + (propane * 8) + (isoButane * 10) + (nButane * 10) + (isoPentane * 12) + (nPentane * 12) + (nHexane * 14) + (nitrogen * 0) + (oxygen * 0) + (carbonDioxide * 0)
        var HcN = HcG - combustionTempCoeff / 2 * HyrdogenNumber
        if(shouldOverwrite === true){
            data.grossHeatingValueMass = (HcG / M)
            data.netHeatingValueMass = (HcN / M)
            data.grossHeatingValueVol = HcG / (z * rTP) / 1000
            data.netHeatingValueVol = HcN / (z * rTP) / 1000
        }
        if (data.volume == null || data.density == null) {
            return data
        }
        data.mass = data.density * data.volume / 1000
        data.grossEnergy = (1/1055.056)*(data.volume*data.density*data.grossHeatingValueMass)
        var ghvVapor = calorificFactors[combustionTempId].methane / ((1 - summationFactors[combustionTempId].methane ** 2) * rTP) / 1000
        if (data.vaporTempAfterTransfer == null || data.vaporPressureAfterTransfer == null) {
            return data
        }
        data.vaporDisplaced = (1/1055.056)* data.volume * (273.15+combustionTempDeg) / (273.15+data.vaporTempAfterTransfer)*data.vaporPressureAfterTransfer/101.325*ghvVapor
        var ghvVaporMass = calorificFactors[combustionTempId].methane/16.04246
        data.gasConsumed = (1/1055.056) * data.quantityConsumed * ghvVaporMass
        return data
    }
}


async function replaceSavedBDN(bdns) {
    const db = await getSavedBDNDB();
    if (bdns instanceof Array) {
        await db.clear(DBNAME)
        await InsertSavedBDN(bdns,db)
    }
    return "Ok"
}

export async function getOpenBDNDB() {
    return await openDB(OPENLOGDBNAME,1,{
        upgrade(db) {
            const store = db.createObjectStore(OPENLOGDBNAME, {keyPath: 'openId',autoIncrement: true,});
            store.createIndex('updateDate', 'updateDate', { unique: false });
        }
    });
}

// save to open table
export async function SaveOpenBDN(bdn) {
    const savedBDNdb = await getSavedBDNDB();
    let cursor = await savedBDNdb.transaction(DBNAME).store.openCursor();
    var maxReportId = 0
    while(cursor) {
        if (cursor.value.reportId > maxReportId) {
            maxReportId = cursor.value.reportId
        }
        cursor = await cursor.continue();
    }
    const db = await getOpenBDNDB();
    const currentOpenBDN = await db.getAll(OPENLOGDBNAME);
    const tx = db.transaction(OPENLOGDBNAME, 'readwrite');
    if (currentOpenBDN.length > 0) {
        bdn.openId = currentOpenBDN[0].openId
        bdn.reportId = currentOpenBDN[0].reportId
        await tx.store.put(bdn)
    } else {
        bdn.reportId = maxReportId + 1
        bdn.generatedDate = new Date()
        bdn.lastUpdateTime = new Date()
        await tx.store.add(bdn)
    }
    await tx.done;
    return bdn
}

export async function getSavedBDNDB() {
    return await openDB(DBNAME,1,{
        upgrade(db) {
            const store = db.createObjectStore(DBNAME, {keyPath: 'submittedId',autoIncrement: true,});
            store.createIndex('reportId', 'reportId', { unique: true });
            store.createIndex('updateDate', 'updateDate', { unique: false });
        }
    });
}

// save from open to submit
export async function SubmitBDN(openbdn) {
    const opendb = await getOpenBDNDB();
    await opendb.clear(OPENLOGDBNAME)
    const db = await getSavedBDNDB();
    openbdn.generatedDate = new Date();
    const tx = db.transaction(DBNAME, 'readwrite');
    await tx.store.add(openbdn);
    return await tx.done;
}

// sync saved bdn table
export async function InsertSavedBDN(dbBDNs,db) {
    const tx = db.transaction(DBNAME, 'readwrite');
    await Promise.all([
        dbBDNs.map(async bdn => {
            await tx.store.add(bdn);
            return bdn
        })
    ]);
    return await tx.done;
}
export async function PostSavedBDN(dbBDNs,db) {
    const tx = db.transaction(DBNAME, 'readwrite');
    await Promise.all([
        dbBDNs.map(async bdn => {
            if (bdn.reportId) {
                let dbIdKeyRange = IDBKeyRange.only(bdn.reportId);
                const currentBDN = await db.getAllFromIndex(DBNAME,'reportId',dbIdKeyRange);
                if (currentBDN.length > 0) {
                    bdn.reportId = currentBDN[0].reportId
                    await tx.store.put(bdn)
                } else {
                    await tx.store.add(bdn)
                }
            } else {
                await tx.store.add(bdn);
            }
            return bdn
        })
    ]);
    return await tx.done;
}

export function getCombustionTempToId() {return CombstionTempToID}
export default BunkerDeliveryNote;