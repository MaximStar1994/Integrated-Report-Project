const config = require('../config/config')
const helper = require('../helper/helperWithoutApi')
const {interfaceObj} = require("./interfaces/PostGreSQLInterface")
const moment = require('moment');
const { uuid } = require('uuidv4');
const pagekey = "VESSELBREAKDOWN"

const VESSELBREAKDOWNEVENTMAP = {
    vesselId : { col : "vessel_id", type: "integer" },
    vesselName : { col : "vessel_name", type: "text" },
    breakdownDatetime : { col : "breakdown_datetime", type: "datetime" }, 
    backToOperationDatetime : { col : "back_to_operation_datetime", type: "datetime" }, 
    reason : { col : "reason", type: "string" }, 
    status : { col : "status", type: "string" }, 
    eventId : { col : "event_id", type: "identity" }, 
    filepath: { col: "file_path", type: "string" }, 
    is_redundant: { col: "is_redundant", type: "string" },
    is_editable: { col: "is_editable", type: "string" },
}
const BREAKDOWNSUPPORTMAP = {
    eventId : { col : "event_id", type: "integer" },
    superintendent : { col : "superintendent", type: "string" }, 
    category : { col : "category", type: "string" }, 
    remarks : { col : "remarks", type: "string" }, 
    vesselReplacement : { col : "vessel_replacement", type: "string" }, 
    vesselCondition : { col : "vessel_condition", type: "string" },
    recordId : { col : "record_id", type: "identity" }, 
}

class VesselBreakdownService {
    constructor () {
        this.sqlInterface = interfaceObj
    }
    async GetUserNameFromAccountId(accountId) {
        let account = await this.sqlInterface.PerformQueryPromise(`
            SELECT name
            FROM ${config.kstConfig.sqlTables.USERACCOUNT}
            WHERE account_id=$1
        `,[accountId])
        if (account instanceof Array && account.length > 0) {
            return account[0].name;
        } else {
            return false;
        }
    }
    async LockVesselBreakdownPage(vesselId, user) {
        var lock = uuid()
        await this.sqlInterface.PerformUpdatePromise(config.kstConfig.sqlTables.LOCK, {
            pagelock : lock,
            currentuser: user
        },{
            page : pagekey,
            vessel_id : vesselId
        })
        return lock
    }
    async CanViewVesselBreakdownPage(userlock, vesselId) {
        let currentlock = await this.sqlInterface.PerformQueryPromise(`
            SELECT pagelock
            FROM ${config.kstConfig.sqlTables.LOCK}
            WHERE vessel_id=$1 AND page='${pagekey}'
        `,[vesselId])
        if (currentlock instanceof Array && currentlock.length > 0) {
            currentlock = currentlock[0].pagelock
            return currentlock === userlock||currentlock==null
        } else {
            return false
        }
    }
    async GetCurrentUser(vesselId) {
        let currentUser = await this.sqlInterface.PerformQueryPromise(`
            SELECT currentuser
            FROM ${config.kstConfig.sqlTables.LOCK}
            WHERE vessel_id=$1 AND page='${pagekey}'
        `,[vesselId])
        if (currentUser instanceof Array && currentUser.length > 0) {
            return currentUser[0].currentuser
        } else {
            return ''
        }
    }
    async UnlockVesselBreakdownPage(vesselId) {
        await this.sqlInterface.PerformQueryPromise(`
            UPDATE ${config.kstConfig.sqlTables.LOCK}
            SET (pagelock, currentuser) = (NULL, NULL)
            WHERE vessel_id=$1 AND page='${pagekey}'
            RETURNING *;
        `,[vesselId])
        return true
    }
    async GetBreakDownEventsForVessel(vesselId,isManagement) {
        let where = {}
        where[VESSELBREAKDOWNEVENTMAP.vesselId.col] = vesselId;
        where[VESSELBREAKDOWNEVENTMAP.is_redundant.col] = false;
        if (isManagement) {
            where[VESSELBREAKDOWNEVENTMAP.status.col] = "closed";
        }
        let events = await this.sqlInterface.GetDataFromTable(
            config.kstConfig.sqlTables.VESSELBREAKDOWNEVENT,VESSELBREAKDOWNEVENTMAP,
            where,
            `${VESSELBREAKDOWNEVENTMAP.breakdownDatetime.col} DESC`)
        let vesselData = await this.sqlInterface.PerformQueryPromise(`
            SELECT vessel_id, name FROM ${config.kstConfig.sqlTables.VESSEL}
            WHERE vessel_id=$1
        `, [vesselId]);
        let vesselName = vesselData[0]['name'];
        let vesselIdentity = vesselData[0]['vessel_id'];

        for(let x=0; x<events.length; x++){
            let where = {}
            where[BREAKDOWNSUPPORTMAP.eventId.col] = events[x].eventId
            let support = await this.sqlInterface.GetDataFromTable(
                config.kstConfig.sqlTables.VESSELBREAKDOWNSUPT,BREAKDOWNSUPPORTMAP,
                where)
                events[x].support = support[0];
        }
        return({vesselId: vesselIdentity, vesselName: vesselName, events: events})
    }
    async GetEvent(eventId) {
        let where = {}
        where[VESSELBREAKDOWNEVENTMAP.eventId.col] = eventId
        let event = await this.sqlInterface.GetDataFromTable(
            config.kstConfig.sqlTables.VESSELBREAKDOWNEVENT,VESSELBREAKDOWNEVENTMAP,
            where)
        if (event.length > 0) {
            return event[0]
        } else {
            return null
        }
    }
    async GetEventSupport(eventId) {
        let where = {}
        where[BREAKDOWNSUPPORTMAP.eventId.col] = eventId
        let support = await this.sqlInterface.GetDataFromTable(
            config.kstConfig.sqlTables.VESSELBREAKDOWNSUPT,BREAKDOWNSUPPORTMAP,
            where)
        if (support.length > 0) {
            return support[0]
        } else {
            return null
        }
    }
    async CreateBreakdownEvent(event) {
        delete event.eventId
        return await this.sqlInterface.InsertRow(event,VESSELBREAKDOWNEVENTMAP,config.kstConfig.sqlTables.VESSELBREAKDOWNEVENT)
    }
    async CreateBreakDownSupport(support) {
        delete support.recordId
        let log = await this.sqlInterface.InsertRow(support,BREAKDOWNSUPPORTMAP,config.kstConfig.sqlTables.VESSELBREAKDOWNSUPT)
        // await this.UpdateEventPostSupport(support)
        return log
    }
    async UpdateBreakdownEvent(event) {
        var update = {}
        var where = {}
        Object.keys(VESSELBREAKDOWNEVENTMAP).forEach(key => {
            if (VESSELBREAKDOWNEVENTMAP[key].type != 'identity') {
                update = helper.updateObjForPG(event[key],VESSELBREAKDOWNEVENTMAP[key].col,update)
            }
        })
        where[VESSELBREAKDOWNEVENTMAP.eventId.col] = event.eventId
        let temp_log = await this.sqlInterface.PerformUpdatePromise(config.kstConfig.sqlTables.VESSELBREAKDOWNEVENT,update,where)
        return temp_log
    }
    async UpdateBreakDownSupport(support) {
        var update = {}
        var where = {}
        Object.keys(BREAKDOWNSUPPORTMAP).forEach(key => {
            if (BREAKDOWNSUPPORTMAP[key].type != 'identity') {
                update = helper.updateObjForPG(support[key],BREAKDOWNSUPPORTMAP[key].col,update)
            }
        })
        where[BREAKDOWNSUPPORTMAP.recordId.col] = support.recordId
        let temp_log = await this.sqlInterface.PerformUpdatePromise(config.kstConfig.sqlTables.VESSELBREAKDOWNSUPT,update,where)
        // await this.UpdateEventPostSupport(support)
        return temp_log
    }
    async UpdateFilePath(eventId, filepath) {
        var update = {}
        var where = {}
        update[VESSELBREAKDOWNEVENTMAP.filepath.col] = filepath
        where[VESSELBREAKDOWNEVENTMAP.eventId.col] = eventId
        let temp_log = await this.sqlInterface.PerformUpdatePromise(config.kstConfig.sqlTables.VESSELBREAKDOWNEVENT,update,where)
        return temp_log
    }
    async ListVesselBreakdownEligibleForPDF() {
        let events = await this.sqlInterface.PerformQueryPromise(`
            SELECT * FROM ${config.kstConfig.sqlTables.VESSELBREAKDOWNEVENT}
            WHERE file_path IS NULL AND status = 'closed'
            ORDER BY event_id;
        `,[]);
        if(events instanceof Array && events.length>0){
            for(const row of events){
                const support = await this.sqlInterface.PerformQueryPromise (`
                    SELECT * FROM ${config.kstConfig.sqlTables.VESSELBREAKDOWNSUPT}
                    WHERE event_id = ${row.event_id}
                `,[]);
                if(support instanceof Array && support.length>0){
                    row.support = support[0];
                }
                else{
                    row.support = {};
                }
            }
            return events;
        }
        else {
            return [];
        }
    }
    async deleteVesselBreakdown(eventId) {
        try {
            await this.sqlInterface.PerformQueryPromise(`
               DELETE FROM ${config.kstConfig.sqlTables.VESSELBREAKDOWNSUPT} WHERE event_id=$1
            `, [eventId]);

          await this.sqlInterface.PerformQueryPromise(`
               DELETE FROM ${config.kstConfig.sqlTables.VESSELBREAKDOWNEVENT} WHERE event_id=$1
            `, [eventId]);
            return true;
        } catch (error) {
            throw new Error(error);
        }
    }
    async vesselDowntimeStatusChange(eventId,status,isEditable) {
        try {
            await this.sqlInterface.PerformQueryPromise(`
                UPDATE ${config.kstConfig.sqlTables.VESSELBREAKDOWNEVENT} SET status=$2,is_editable=$3
                WHERE event_id=$1
                `, [eventId, status, isEditable]);
            return true;
        } catch (error) {
            throw new Error(error);   
        }
    }

    async isRedundantBreakdownEvent(eventId, isRedundant, isEditable, status) {
        try {
            await this.sqlInterface.PerformQueryPromise(`
                UPDATE ${config.kstConfig.sqlTables.VESSELBREAKDOWNEVENT} SET is_redundant=$2,is_editable=$3,status=$4
                WHERE event_id=$1
                `, [eventId,isRedundant,isEditable,status]);
            return true;
        } catch (error) {
            throw new Error(error); 
        }
    }
}
module.exports = {
    service : new VesselBreakdownService(),
    mappings : {
        BREAKDOWNSUPPORTMAP,
        VESSELBREAKDOWNEVENTMAP
    },
}