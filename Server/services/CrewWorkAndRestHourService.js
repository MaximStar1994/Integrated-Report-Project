const config = require('../config/config');
const {interfaceObj} = require("./interfaces/PostGreSQLInterface")
const { uuid } = require('uuidv4');
const moment = require('moment');
const pagekey = "CREWWORKANDRESTHOUR";
const CREWWORKANDRESTMAP = {
    vesselId : { col : "vessel_id", type: "integer" }, 
    vesselName : { col : "vessel_name", type: "text" },
    rank : { col : "rank", type: "text" },
    crewId : { col : "crew_id", type: "integer" },
    employeeNo : { col : "employee_no", type: "text" },
    crewName : { col : "crew_name", type: "text" },
    watchkeeper : { col : "watchkeeper", type: "boolean" },
    month : { col : "month", type: "integer" },
    year : { col : "year", type: "integer" },
    authorisedPersonName : {col: "authorised_person_name", type: "string"},
    authorisedPersonSignature : {col: "authorised_person_signature", type: "string"},
    seafarerName : {col: "seafarer_name", type: "string"},
    seafarerSignature : {col: "seafarer_signature", type: "string"}, 
    dateSubmitted : { col : "date_submitted", type: "datetime" },
    filepath : { col : "file_path", type: "string" },
}
const CREWWORKANDRESTUPDATEMAP = {
    crewId : { col : "crew_id", type: "integer" },
    employeeNo : { col : "employee_no", type: "text" },
    crewName : { col : "crew_name", type: "text" },
    month : { col : "month", type: "integer" },
    year : { col : "year", type: "integer" },
    date : {col: "date", type: "integer"},
    startCell : {col: "start_cell", type: "integer"},
    endCell : {col: "end_cell", type: "integer"},
    isWorking : {col: "is_working", type: "integer"},
    dateSubmitted : { col : "date_submitted", type: "datetime" }
}
class CrewWorkAndRestHourService {
    constructor () {
        this.sqlInterface = interfaceObj
    }
    /*Not Used*/
    async LockCrewWorkAndRestHourPage(crewId) {
        var lock = uuid()
        await this.sqlInterface.PerformUpdatePromise(config.kstConfig.sqlTables.LOCK, {
            pagelock : lock
        },{
            page : pagekey,
            crew_id: crewId
        })
        return lock
    }
    async CanViewCrewWorkAndRestHourPage(crewId, userlock) {
        let currentlock = await this.sqlInterface.PerformQueryPromise(`
            SELECT pagelock
            FROM ${config.kstConfig.sqlTables.LOCK}
            WHERE crew_id=$1 AND page='${pagekey}'
        `,[crewId])
        if (currentlock instanceof Array && currentlock.length > 0) {
            currentlock = currentlock[0].pagelock
            return currentlock === userlock||currentlock==null
        } else {
            return false
        }
    }
    async UnlockCrewWorkAndRestHourPage(crewId) {
        await this.sqlInterface.PerformQueryPromise(`
            UPDATE ${config.kstConfig.sqlTables.LOCK}
            SET pagelock = NULL
            WHERE crew_id=$1 AND page='${pagekey}'
            RETURNING *;
        `,[crewId])
        return true
    }
    async GetPreviousSubmission(employeeNo, month, year){
        let prevRecords = await this.sqlInterface.PerformQueryPromise(`
        SELECT * FROM ${config.kstConfig.sqlTables.CREWWORKREST} WHERE employee_no=$1 AND month=$2 AND year=$3;
        `,[employeeNo, month, year])
        if(prevRecords instanceof Array && prevRecords.length>0){
            return true;
        }
        else{
            return false;
        }
    }
    isEmpty = (element) =>{
        if(element===undefined || element===null)
            return true;
        else if(typeof(element) === 'string'){
            if(element.trim()===''){
                return true
            }
            else{
                return false
            }
        }
        else
            return false;
    }
    async GetCrewWorkAndRestHourData(employeeNo, month, year) {
        if(this.isEmpty(employeeNo)===true || isNaN(month) || isNaN(year)){
            return null;
        }
        else{
            month = parseInt(month);
            year = parseInt(year);
        }
        let crewVesselData = await this.sqlInterface.PerformQueryPromise(`
        SELECT c.crew_id, c.employee_no, c.name as crewname, c.rank, c.vessel_id, v.name
	    FROM ${config.kstConfig.sqlTables.CREW} c LEFT JOIN ${config.kstConfig.sqlTables.VESSEL} v ON c.vessel_id = v.vessel_id WHERE c.employee_no=$1;
        `,[employeeNo])
        if(crewVesselData instanceof Array && crewVesselData.length>0){
            crewVesselData = {
                crewId: parseInt(crewVesselData[0].crew_id),
                employeeNo: crewVesselData[0].employee_no,
                crewName: crewVesselData[0].crewname,
                rank: crewVesselData[0].rank,
                vesselId: parseInt(crewVesselData[0].vessel_id),
                vesselName: crewVesselData[0].name
            };
        }
        else {
            throw new Error('Crew Not Found');
        }
        // let prevMonth = month===0?11:month-1;
        // let prevYear = month===0?year-1:year;
        // let prevDate = moment().set('year', year).set('month', prevMonth).endOf('month').date();
    //     let startMonthMorningShift =  await this.sqlInterface.PerformQueryPromise(`
    //     SELECT date, shift, is_working
    //     FROM ${config.kstConfig.sqlTables.VESSELREPORTCREW} WHERE employee_no=$1 AND is_working=1 AND 
    //     EXTRACT('year' FROM TO_DATE(date, 'DD-MM-YYYY')) = $4 AND
    //     EXTRACT('month' FROM TO_DATE(date, 'DD-MM-YYYY')) = $3 AND
    //     EXTRACT('day' FROM TO_DATE(date, 'DD-MM-YYYY')) = $2 AND
    //     shift = 2
    // `,[employeeNo, prevDate, prevMonth, prevYear]);
    //     if(startMonthMorningShift instanceof Array && startMonthMorningShift.length>0){
    //         startMonthMorningShift = true;
    //     }
    //     else {
    //         startMonthMorningShift = false;
    //     }

        let crewWorkingData = {};
        let lastDate = moment().set('year', year).set('month', month).endOf('month').date();
        for(let i=1; i<=lastDate; i++){
            crewWorkingData[i] = {};
            for(let j=0; j<48; j++){
                crewWorkingData[i][j] = false;
            }
        }
        // crewWorkingData[1]['1'] = startMonthMorningShift;
        // let crewWorkingRecords = await this.sqlInterface.PerformQueryPromise(`
        //     SELECT date, shift, is_working
        //     FROM ${config.kstConfig.sqlTables.VESSELREPORTCREW} WHERE employee_no=$1 AND is_working=1 AND 
        //     EXTRACT('year' FROM TO_DATE(date, 'DD-MM-YYYY')) = $3 AND
        //     EXTRACT('month' FROM TO_DATE(date, 'DD-MM-YYYY')) = $2 ORDER BY TO_DATE(date, 'DD-MM-YYYY')
        // `,[employeeNo, month+1, year]);
        // if(crewWorkingRecords instanceof Array && crewWorkingRecords.length>0){
        //     crewWorkingRecords.forEach(element => {
        //         let elementDate = moment(element.date, "DD-MM-YYYY").date();
        //         if(element.shift===1){
        //             crewWorkingData[elementDate]['2'] = true;
        //         }
        //         else if(element.shift===2){
        //             crewWorkingData[elementDate]['3'] = true;
        //             if(elementDate!==lastDate){
        //                 crewWorkingData[elementDate+1]['1'] = true;
        //             }
        //         }
        //     })
        // }
    //     let startMonthMorningShiftAdminUpdate =  await this.sqlInterface.PerformQueryPromise(`
    //     SELECT form_id, crew_id, employee_no, crew_name, month, year, date, shift, is_working
    //         FROM ${config.kstConfig.sqlTables.CREWWORKRESTADMINUPDATE} WHERE employee_no=$1 AND 
    //         year = $4 AND
    //         month = $3 AND
    //         date = $2 AND 
    //         shift = 2
    //         ORDER BY date_submitted
    // `,[employeeNo, prevDate, prevMonth, prevYear]);
        // if(startMonthMorningShiftAdminUpdate instanceof Array && startMonthMorningShiftAdminUpdate.length>0){
        //     let temp = startMonthMorningShiftAdminUpdate[startMonthMorningShiftAdminUpdate.length-1];
        //     if(temp.is_working==='1'||temp.is_working===1)
        //         startMonthMorningShiftAdminUpdate = true;
        //     else
        //         startMonthMorningShiftAdminUpdate = false;
        // }
        // else {
        //     startMonthMorningShiftAdminUpdate = null;
        // }
        // if(startMonthMorningShiftAdminUpdate!==null)
        //     crewWorkingData[1]['1'] = startMonthMorningShiftAdminUpdate;
        let crewWorkingRestingUpdateRecords = await this.sqlInterface.PerformQueryPromise(`
            SELECT form_id, crew_id, employee_no, crew_name, month, year, date, start_cell, end_cell, is_working
            FROM ${config.kstConfig.sqlTables.CREWWORKRESTUPDATE} WHERE employee_no=$1 AND 
            year = $3 AND
            month = $2 ORDER BY date_submitted
        `,[employeeNo, month, year]);
        if(crewWorkingRestingUpdateRecords instanceof Array && crewWorkingRestingUpdateRecords.length>0){
            crewWorkingRestingUpdateRecords.forEach(element => {
                for(let t=element.start_cell; t<element.end_cell&&t<48; t++){
                    crewWorkingData[element.date][t] = element.is_working==='1'||element.is_working===1?true:false;
                }
            })
        }
        let totalRestHours = 0;
        for (const [cwdDate, cwdTime] of Object.entries(crewWorkingData)) {
            let temp = 0;
            for (const [cwdTimeKey, cwdTimeValue] of Object.entries(cwdTime)) {
                if(cwdTimeValue===false){
                    temp+=1
                }
            }
            cwdTime['totalRestHours'] = temp*0.5;
            totalRestHours += temp*0.5;
        }
        return {crewVesselData: crewVesselData, crewWorkingData: crewWorkingData, totalRestHours: totalRestHours};
    }
    async ListCrewWorkAndRestReportEligibleForPDF() {
        let crewWorkAndRestReport = await this.sqlInterface.PerformQueryPromise(`
            SELECT form_id, vessel_id, vessel_name, rank, crew_id, employee_no, crew_name, watchkeeper, month, year, authorised_person_signature, authorised_person_name, seafarer_signature, seafarer_name, file_path, date_submitted
            FROM ${config.kstConfig.sqlTables.CREWWORKREST}
            WHERE file_path IS NULL 
            ORDER BY form_id DESC;
        `,[]);
        if (crewWorkAndRestReport instanceof Array && crewWorkAndRestReport.length > 0) {
            var reportsEligible = [];
            for (const row of crewWorkAndRestReport){
                let temp = {
                    formId: row.form_id,
                    vesselId: row.vessel_id,
                    vesselName: row.vessel_name,
                    rank: row.rank,
                    crewId: row.crew_id,
                    employeeNo: row.employee_no,
                    crewName: row.crew_name,
                    watchkeeper: row.watchkeeper,
                    month: row.month,
                    year: row.year,
                    authorisedPersonName: row.authorised_person_name,
                    authorisedPersonSignature: row.authorised_person_signature,
                    seafarerName: row.seafarer_name,
                    seafarerSignature: row.seafarer_signature,
                    filepath: row.file_path,
                    dateSubmitted: row.date_submitted
                }
                const report = await this.GetCrewWorkAndRestHourData(row.employee_no, row.month, row.year);
                temp.crewWorkingData = report;
                reportsEligible.push(temp);
            }
            return reportsEligible;
        } else {
            return [];
        }
    }
    async UpdateCrewWorkAndRestHourFilePath(reportId, filepath) {
        var update = {
            file_path : filepath
        }
        let crewWorkRestreport = await this.sqlInterface.PerformUpdatePromise(
            config.kstConfig.sqlTables.CREWWORKREST,
            update,
            {form_id : reportId})
        return crewWorkRestreport
    }
    async CreateCrewWorkAndRestHour(crewWorkAndRestRecord) {
        let dbCrewWorkRest = await this.sqlInterface.InsertRow(crewWorkAndRestRecord,CREWWORKANDRESTMAP,config.kstConfig.sqlTables.CREWWORKREST)
        crewWorkAndRestRecord.formId = dbCrewWorkRest.form_id
        return crewWorkAndRestRecord
    }
    isEmpty = element => {
        if(element===undefined||element===null)
            return true
        else if(typeof(element)==='string'){
            if(element.trim()===""){
                return true;
            }
            else
                return false;
        }
        else
            return false;
    }
    async ListCrew() {
        let vessel = await this.sqlInterface.PerformQueryPromise(`
        SELECT vessel_id, name
        FROM ${config.kstConfig.sqlTables.VESSEL} ORDER BY vessel_id
        `,[]);
        let crew = await this.sqlInterface.PerformQueryPromise(`
        SELECT c.crew_id, c.employee_no, c.name as crewname, rank, c.vessel_id, c.nationality, v.name as vesselname
        FROM ${config.kstConfig.sqlTables.CREW} c LEFT JOIN ${config.kstConfig.sqlTables.VESSEL} v on c.vessel_id=v.vessel_id WHERE c.name IS NOT NULL
        ORDER BY c.crew_id;
        `,[]);
        let tempVessel = [];
        let tempCrew = [];
        if(vessel instanceof Array && vessel.length>0){
            for(let i=0; i<vessel.length; i++){
                tempVessel.push({
                    vesselId: parseInt(vessel[i].vessel_id),
                    vesselName: vessel[i].name
                })
            }
        }
        if(crew instanceof Array && crew.length>0){
            for(let i=0; i<crew.length; i++){
                if(this.isEmpty(crew[i].crewname)===false && this.isEmpty(crew[i].employee_no)===false){
                    tempCrew.push({
                        crewId: parseInt(crew[i].crew_id),
                        employeeNo: crew[i].employee_no,
                        crewName: crew[i].crewname,
                        rank: crew[i].rank,
                        nationality: crew[i].nationality,
                        vesselId: parseInt(crew[i].vessel_id),
                        vesselName: crew[i].vesselname
                    })
                }
            }
        }
        return {vessel: tempVessel, crew: tempCrew};
    }
    async GetCrewWorkAndRestHourUpdate(month, year) {
        if(isNaN(month) || isNaN(year)){
            return null;
        }
        else{
            month = parseInt(month);
            year = parseInt(year);
        }
        let data = await this.sqlInterface.PerformQueryPromise(`
        SELECT form_id, crew_id, employee_no, crew_name, month, year, date, start_cell, end_cell, is_working
            FROM ${config.kstConfig.sqlTables.CREWWORKRESTUPDATE} WHERE 
            year = $2 AND
            month = $1 ORDER BY date_submitted desc
        `,[month, year])
        if(data instanceof Array && data.length>0){
            let UpdateData = [];
            data.forEach(element=>{
                UpdateData.push({
                    formId: parseInt(element.form_id),
                    crewId: parseInt(element.crew_id),
                    employeeNo: element.employee_no,
                    crewName: element.crew_name,
                    month: element.month,
                    year: element.year,
                    date: element.date,
                    startCell: element.start_cell,
                    endCell: element.end_cell,
                    isWorking: element.is_working
                });
            })
            return UpdateData;
        }
        else{
            return [];
        }
    }
    async CreateCrewWorkAndRestHourUpdate(log) {
        if(log.overnight===true){
            let temp = {...log, endCell: 48};
            let temp2 = {...log, startCell: 0};
            if(moment().month(parseInt(temp2.month)).endOf('month').get('date')===temp2.date){
                if(parseInt(temp2.month)===11){
                    temp2.date=1;
                    temp2.month = '0';
                    temp2.year = (parseInt(temp2.year)+1).toString();
                }
                else{
                    temp2.date=1;
                    temp2.month = (parseInt(temp2.month)+1).toString();
                }
            }
            else{
                temp2.date+=1;
            }
            let dbCrewWorkRest = await this.sqlInterface.InsertRow(temp,CREWWORKANDRESTUPDATEMAP,config.kstConfig.sqlTables.CREWWORKRESTUPDATE)
            dbCrewWorkRest = await this.sqlInterface.InsertRow(temp2,CREWWORKANDRESTUPDATEMAP,config.kstConfig.sqlTables.CREWWORKRESTUPDATE)
            log.formId = dbCrewWorkRest.form_id
        }
        else{
            let dbCrewWorkRest = await this.sqlInterface.InsertRow(log,CREWWORKANDRESTUPDATEMAP,config.kstConfig.sqlTables.CREWWORKRESTUPDATE)
            log.formId = dbCrewWorkRest.form_id
        }
        return log
    }
}
module.exports = {
    service : new CrewWorkAndRestHourService()
};