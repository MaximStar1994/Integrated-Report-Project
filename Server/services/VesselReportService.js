const config = require('../config/config')
const helper = require('../helper/helperWithoutApi')
const {interfaceObj} = require("./interfaces/PostGreSQLInterface")
const moment = require('moment-timezone')
const { uuid } = require('uuidv4');
const pagekey = "VESSELREPORT";
const PENDING_STATUS = "pending";

const VESSELREPORTMAP = {
    formId : { col : "form_id", type: "identity" },
    shift : { col : "shift", type: "integer" },
    vesselId : { col : "vessel_id", type: "integer" }, 
    filepath : { col : "file_path", type: "string" },
    captainName : {col: "captain_name", type: "string"},
    captainSignature : {col: "captain_signature", type: "string"},
    chiefEngineerName : {col: "chief_engineer_name", type: "string"},
    chiefEngineerSignature : {col: "chief_engineer_signature", type: "string"}, 
    remark : { col : "remark", type: "string" },
    formDate : { col : "form_date", type: "datetime" },
    reportDate: { col : "report_date", type: "string" },
    is_backdated: { col: "is_backdated", type: "bool" },
    is_offline: { col: "is_offline", type: "bool" },
    desktopFormID: {col: "desktop_app_form_id",type: "integer"}
}
const ROBIDENTIFERS = {
    GRADE40 : "Grade 40",
    GRADE46 : "Grade 46",
    GRADE68 : "Grade 68",
    GRADE100 : "Grade 100",
    GRADEP100 : "Grade P100",
    FUELOIL : "Fuel Oil",
    FRESHWATER : "Fresh Water"
}
const ROBMAP = {
    identifier :  { col : "identifier", type: "string" },
    carryForward: { col : "carry_forward_rob", type: 'decimal' },
    received :  { col : "received", type: "decimal" },
    consumed :  { col : "consumed", type: "decimal" },
    rob :  { col : "rob", type: "decimal" },
}
const TANKSOUNDINGIDENTIFIERS = {
    FODAY1 : "FODAY1",
    FODAY2 : "FODAY2",
    FO1 : "FO1",
    FO2 : "FO2",
    FO3 : "FO3",
    FO4 : "FO4",
    FO5 : "FO5",
    FO6 : "FO6",
    FW1 : "FW1",
    FW2 : "FW2",
    LO : "LO",
    HYDRAULIC: "H",
    SEWAGE : "S",
    GRAYWATER : "GW",
    WASTEROIL : "WO",
    OILYWATER : "OW",
    SLUDGE : "SLUDGE",
    DISPERSANT : "DIS",
    FOAM : "FOAM",
    BALLAST1 : "B1",
    BALLAST2 : "B2",
    BALLAST3 : "B3",
    BALLAST4 : "B4",
}
const TANKSOUNDINGMAP = {
    identifier :  { col : "identifier", type: "string" },
    level :  { col : "level_reading", type: "decimal" },
    volume :  { col : "volume", type: "decimal" },
}
const ENGINEIDENTIFIERS = {
    SMainEngine : "S",
    PMainEngine : "P",
}
const ELOGMAPPING = {
    engineIdentifier : { col : "engine_identifier", type: "string" },
    // carryForwardRunningHour: {col: "carry_forward_running_hour", type: 'decimal'},
    // runningHour : {col: "running_hour", type: 'decimal'},
    // LNGcarryForwardRunningHour: {col: "lng_carry_forward_running_hour", type: 'decimal'},
    // LNGrunningHour : {col: "lng_running_hour", type: 'decimal'},
    // totalRunningHour:  {col: "total_running_hour", type: 'decimal'},
    // totalLNGRunningHour:  {col: "total_lng_running_hour", type: 'decimal'},
    rpm : { col : "rpm", type: "decimal" },
    propellerRpm : { col : "propeller_rpm", type: "decimal" },
    cppPitch : { col : "cpp_pitch", type: "decimal" },
    fuelrack : { col : "fuelrack", type: "string" },
    lubOilPressure : { col : "lub_oil_pressure", type: "decimal" },
    freshwaterPressure : { col : "freshwater_pressure", type: "decimal" },
    seawaterPressure : { col : "seawater_pressure", type: "decimal" },
    chargeAirPressure : { col : "charge_air_pressure", type: "decimal" },
    turboChargerLubOilPressure : { col : "turbo_charger_lub_oil_pressure", type: "decimal" }, 
    fuelOilPressure : { col : "fuel_oil_pressure", type: "decimal" },
    lubOilTempBfCooler : { col : "lub_oil_temp_bf_cooler", type: "decimal" },
    lubOilTempAfCooler : { col : "lub_oil_temp_af_cooler", type: "decimal" }, 
    freshwaterTempIn : { col : "freshwater_temp_in", type: "decimal" }, 
    freshwaterTempOut : { col : "freshwater_temp_out", type: "decimal" },
    seawaterTempIn : { col : "seawater_temp_in", type: "decimal" },
    seawaterTempOut : { col : "seawater_temp_out", type: "decimal" },
    turboChargerRpm : { col : "turbocharger_rpm", type: "decimal" }, 
    turboChargerExhaustTempIn : { col : "turbocharger_exhaust_temp_in", type: "decimal" }, 
    turboChargerExhaustTempOut : { col : "turbocharger_exhaust_temp_out", type: "decimal" }, 
    chargeAirTemp : { col : "charge_air_temp", type: "decimal" }, 
    cylinder1PeakPressure : { col : "cylinder1_peak_pressure", type: "decimal" },
    cylinder1ExhaustTemp : { col : "cylinder1_exhaust_temp", type: "decimal" },
    cylinder2PeakPressure : { col : "cylinder2_peak_pressure", type: "decimal" },
    cylinder2ExhaustTemp : { col : "cylinder2_exhaust_temp", type: "decimal" },
    cylinder3PeakPressure : { col : "cylinder3_peak_pressure", type: "decimal" },
    cylinder3ExhaustTemp : { col : "cylinder3_exhaust_temp", type: "decimal" },
    cylinder4PeakPressure : { col : "cylinder4_peak_pressure", type: "decimal" },
    cylinder4ExhaustTemp : { col : "cylinder4_exhaust_temp", type: "decimal" },
    cylinder5PeakPressure : { col : "cylinder5_peak_pressure", type: "decimal" },
    cylinder5ExhaustTemp : { col : "cylinder5_exhaust_temp", type: "decimal" },
    cylinder6PeakPressure : { col : "cylinder6_peak_pressure", type: "decimal" },
    cylinder6ExhaustTemp : { col : "cylinder6_exhaust_temp", type: "decimal" },
    cylinder7PeakPressure : { col : "cylinder7_peak_pressure", type: "decimal" },
    cylinder7ExhaustTemp : { col : "cylinder7_exhaust_temp", type: "decimal" },
    cylinder8PeakPressure : { col : "cylinder8_peak_pressure", type: "decimal" },
    cylinder8ExhaustTemp : { col : "cylinder8_exhaust_temp", type: "decimal" },
    remarks : { col : "remarks", type: "string" },
}
const GENERATORIDENTIFIERS = {
    AE1 : "AE1",
    AE2 : "AE2",
    AE3 : "AE3",
}
const GENERATORMAPPING = {
    // carryForwardRunningHour: {col: "carry_forward_running_hour", type: 'decimal'},
    // runningHour : {col: "running_hour", type: 'decimal'},
    // totalRunningHour:  {col: "total_running_hour", type: 'decimal'},
    voltage : {col: "voltage", type: 'decimal'},
    frequency : {col: "frequency", type: 'decimal'}, 
    current : {col: "current", type: 'decimal'}, 
    power : {col: "power", type: 'decimal'},
    foPressue : { col : "fo_pressure", type: "decimal" },
    loPressure : { col : "lo_pressure", type: "decimal" }, 
    loTemp : { col : "lo_temperature", type: "decimal" },
    loLevel : { col : "lo_level", type: "string" }, 
    coolingWaterTempIn : { col : "cooling_water_temp_in", type: "decimal" },
    coolingWaterTempOut : { col : "cooling_water_temp_out", type: "decimal" },
    exhaustTemp : { col : "exhaust_temp", type: "decimal" },
    remarks : { col : "remarks", type: "string" },
    generatorIdentifier : { col : "generator_identifier", type: "string" },
}
const ACIDENTIFIER = {
    AC1 : "AC1",
}
const ACMAP = {
    identifier : { col : "identifier", type: "string" },
    compressorCurrent : { col : "compressor_current", type: "decimal" },
    compressorSuctionPressure : { col : "compressor_suction_pressure", type: "decimal" },
    compressorDischargePressure : { col : "compressor_discharge_pressure", type: "decimal" },
    loPressure : { col : "lub_oil_pressure", type: "decimal" },
    coolingWaterPressure : { col : "cooling_water_pressure", type: "decimal" },
    remarks : { col : "remarks", type: "string" },
}
const ZPCLUTCHIDENTIFIERS = {
    SZPCLutch : "S",
    PZPCLutch : "P",
}
const ZPCLUTCH = {
    identifier : { col : "zpclutch_identifier", type: "string" },
    zpLoLevel : { col : "zp_lub_oil_level", type: "string" },
    zpLoPressure : { col : "zp_lub_oil_pressure", type: "decimal" },
    zpChargeOilPressure :   { col : "zp_charge_oil_pressure", type: "decimal" },
    zpLoTemp : { col : "zp_lub_oil_temp", type: "decimal" },
    zpHoLevel : { col : "zp_h_oil_level", type: "string" },
    zpHoTempIn : { col : "zp_h_oil_temp_in", type: "decimal" },
    zpHoTempOut : { col : "zp_h_oil_temp_out", type: "decimal" },
    clutchOilPressure : { col : "clutch_oil_pressure", type: "decimal" },
    zpRemarks: {col: 'remarks', type: 'string'}
}
const DECKLOGMAP = {
    // decklogId : 'decklog_id',
    startLocation : { col : "start_location", type: "string" },
    endLocation : { col : "end_location", type: "string" },
    starttime : { col : "starttime", type: "datetime" },
    endtime : { col : "endtime", type: "datetime" },
    status : { col : "status", type: "string" },
    otherStatus : { col : "other_status", type: "string" },
    typeOfJob : { col : "type_of_job", type: "string" },
    tugPosition : { col : "tug_position", type: "string" },
    noOfTugs : { col : "no_of_tugs", type: "decimal" },
    order : { col : "order_priority", type: "decimal" },
}

const AUTHORIZEDBACKDATEDVESSELREPORTFORMMAP = {
    id: { col: "id", type: "identity" },
    vesselId: { col: "vessel_id", type: "integer" },
    form: { col: "form", type: "string" },
    status: { col: "status", type: "string" },
    createdBy: { col: "created_by", type: "integer" },
    createdDate: { col: "created_date", type: "datetime" },
    reportDate: {col: "report_date", type: "string"},
    desktopAppFormID: {col: "desktop_backdated_id",type: "integer"}
};

const EXCELGENERATECATEGORY = {
    ENGINERUNNINGHOURS: 'Engine Running Hours',
    CONSUMABLESROB: 'Consumables ROB',
    TANKSOUNDINGS: 'Tank Soundings',
    ACKNOWLEDGEMENTS: 'Acknowledgements',
    DECKLOG: 'Deck Log Info',
    ENGINES: 'Engines',
    GENERATORS: 'Generators',
    AZIMUTHTHRUSTER: 'Azimuth Thruster',
    AIRCONDITIONING: 'Air Conditioning'
};

const ACKNOWLEDGEMENTSTYLE = {
    fill: { patternType: "solid", fgColor: { rgb: "fffcddb0" } },
    border: {
        left: { style: "thin", color: { rgb: "ff000000" } },
        right: { style: "thin", color: { rgb: "ff000000" } },
        top: { style: "thin", color: { rgb: "ff000000" } },
        bottom: { style: "thin", color: { rgb: "ff000000" } }
    }
};

const ENGINERUNNINGHOURSTYLE = {
    fill: { patternType: "solid", fgColor: { rgb: "fffffad7" } },
    border: {
        left: { style: "thin", color: { rgb: "ff000000" } },
        right: { style: "thin", color: { rgb: "ff000000" } },
        top: { style: "thin", color: { rgb: "ff000000" } },
        bottom: { style: "thin", color: { rgb: "ff000000" } }
    }
};

class VesselReportService {
    constructor () {
        this.sqlInterface = interfaceObj
    }

    async saveAuthorizedBackDatedData(authorizedBackDatedData, user) {
        try {  
          for (const obj of authorizedBackDatedData) {
            //desktopAppFormID variable used to differenciate desktop app req and web app req. This condition satisfies when the req is from web app 
            if(helper.IsEmpty(obj.desktopAppFormID)) {
                obj.status = "pending";
                obj.createdBy = user.accountId;
                obj.createdDate = new Date();
            }
            await this.sqlInterface.InsertRow( obj, AUTHORIZEDBACKDATEDVESSELREPORTFORMMAP, config.kstConfig.sqlTables.AUTHORIZEDBACKDATEDVESSELREPORTFORM );
          }
    
          return await this.fetchAuthorizedBackDatedData();
        } catch (error) {
          throw new Error(error);
        }
    }
    
    async fetchAuthorizedBackDatedData() {
        try {
          const status = "pending";
          let authorizedBackDatedList = await this.sqlInterface.PerformQueryPromise(
            `
            select a.id as id,a.form as form,a.status as status,v.name as vesselname,u.username as createdby,a.report_date as reportdate,a.created_date as createddate from 
            ${config.kstConfig.sqlTables.AUTHORIZEDBACKDATEDVESSELREPORTFORM} as a,
            ${config.kstConfig.sqlTables.VESSEL} as v,${config.kstConfig.sqlTables.USERACCOUNT} as u 
            where v.vessel_id = a.vessel_id and u.account_id = a.created_by and a.status=$1 order by a.created_date desc
              `,
            [status]
          );
          return authorizedBackDatedList;
        } catch (error) {
          throw new Error(error);
        }
    }
    
    async deleteAuthorizedBackDatedDataById(backDatedId) {
        try {
          const status = "removed";
          await this.sqlInterface.PerformQueryPromise(
            `
                  UPDATE ${config.kstConfig.sqlTables.AUTHORIZEDBACKDATEDVESSELREPORTFORM}
                  SET status=$2 WHERE id=$1
              `,
            [backDatedId, status]
          );
          return await this.fetchAuthorizedBackDatedData();
        } catch (error) {
          throw new Error(error);
        }
    }
    
    async checkAuthorizedBackDatedData(authorizedBackDatedData) {
        try {
          var authorizedBackDatedFormList = [];
          const status = "pending";
    
          for (const obj of authorizedBackDatedData) {
            var queryResponse = await this.sqlInterface.PerformQueryPromise(
              `
              select a.form from ${config.kstConfig.sqlTables.AUTHORIZEDBACKDATEDVESSELREPORTFORM} as a
              where a.status=$1 and a.form=$2 and a.vessel_id=$3 and a.report_date=$4
              `,
              [status, obj.form, obj.vesselId, obj.reportDate]
            );
    
            if (queryResponse.length > 0) {
              // here I am forming array of strings and the data is getting from frontend - hari
              authorizedBackDatedFormList.push(obj.form);
            }
          }
          return authorizedBackDatedFormList;
        } catch (error) {
          throw new Error(error);
        }
      }
    
    async isAuthorizedBackDatedDataAvailable(vesselId) {
        try {
          const status = "pending";
          //distinct on is working same like  group by [It will remove duplicate records of same report_date and kept one recent row]
          var queryResponse = await this.sqlInterface.PerformQueryPromise(
            `
            select * from (select distinct on (a.report_date) a.form,a.report_date as reportdate,false as checked,a.created_date as createddate from ${config.kstConfig.sqlTables.AUTHORIZEDBACKDATEDVESSELREPORTFORM} as a
            where a.status=$1 and a.vessel_id=$2 ORDER BY a.report_date) t order by createddate asc
              `,
            [status, vesselId]
          );
    
          return queryResponse;
        } catch (error) {
          throw new Error(error);
        }
    }
    
    async isAuthorizedBackDatedDataComplete(queryParam) {
        try {
          const conditionalStatus = "pending";
          const status = "completed";
          await this.sqlInterface.PerformQueryPromise(
            `
                  UPDATE ${config.kstConfig.sqlTables.AUTHORIZEDBACKDATEDVESSELREPORTFORM}
                  SET status=$3 WHERE vessel_id=$1 and form=$2 and status=$4 and report_date=$5
              `,
            [
              queryParam.vesselId,
              queryParam.form,
              status,
              conditionalStatus,
              queryParam.reportDate
            ]
          );
          return await this.fetchAuthorizedBackDatedData();
        } catch (error) {
          throw new Error(error);
        }
    }

    async LockVesselReportPage(vesselId) {
        var lock = uuid()
        await this.sqlInterface.PerformUpdatePromise(config.kstConfig.sqlTables.LOCK, {
            pagelock : lock
        },{
            page : pagekey,
            vessel_id : vesselId
        })
        return lock
    }
    async CanViewVesselReportPage(vesselId, userlock) {
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
    async GetVessel(vesselId) {
        var vesselName = await this.sqlInterface.PerformQueryPromise(`
            SELECT vessel_id as id, name
            FROM ${config.kstConfig.sqlTables.VESSEL}
            WHERE vessel_id=$1
        `,[vesselId])
        return vesselName[0];
    }
    async GetGeneratorStructure(vesselId) {
        var generators = await this.sqlInterface.PerformQueryPromise(`
            SELECT generator_identifier
            FROM ${config.kstConfig.sqlTables.GENERATOR}
            WHERE vessel_id=$1 ORDER BY order_id
        `,[vesselId])
        return generators;
    }
    async GetCrewData(vesselId) {
        var crewData = await this.sqlInterface.PerformQueryPromise(`
            SELECT crew_id, name, rank, employee_no
            FROM ${config.kstConfig.sqlTables.CREW}
            WHERE vessel_id=$1 ORDER BY crew_id
        `,[vesselId])
        return crewData;
    }
    async GetVesselName(vesselId){
        let vesselName = await this.sqlInterface.PerformQueryPromise(`
        SELECT name FROM ${config.kstConfig.sqlTables.VESSEL} WHERE vessel_id=$1
        `, [vesselId]);
        if(vesselName instanceof Array && vesselName.length>0){
            return vesselName[0].name;
        }
    }
    async GetMarineMDeckLog(vesselId, reportDate, shift){
        let start = ''
        let end = ''
        if(shift===1){
            start = moment(`${reportDate} 07:30:00`, 'DD-MM-YYYY HH:mm:ss')
            end = moment(`${reportDate} 19:29:59`, 'DD-MM-YYYY HH:mm:ss')
        }
        else if(shift===2){
            start = moment(`${reportDate} 19:30:00`, 'DD-MM-YYYY HH:mm:ss')
            end = moment(`${reportDate} 07:29:59`, 'DD-MM-YYYY HH:mm:ss')
            end.add(1, 'days');
        }
        start = start.format('YYYY-MM-DD HH:mm:ss+08')
        end = end.format('YYYY-MM-DD HH:mm:ss+08')
        console.log(start, end)
        if(start!=='' && end!==''){
            let decklogs = await this.sqlInterface.PerformQueryPromise(`
                select o.order_srt,o.vessel_name,tsd.stage_name, 
                td.from_location , td.to_location,  tsd.stage_time
                FROM ${config.kstConfig.sqlTables.MARINEMORDERS} o
                LEFT JOIN ${config.kstConfig.sqlTables.MARINEMTASKDETAILS} td ON o.order_id = td.order_id
                LEFT JOIN ${config.kstConfig.sqlTables.MARINEMTASKSTAGESDETAILS} tsd ON tsd.task_id = td.task_id
                LEFT JOIN vessel ON LOWER(resource_name)=LOWER(vessel.name)
                where stage_time is not null and o.order_srt >$2 and o.order_srt <=$3
                AND vessel.vessel_id=$1
                order by tsd.stage_time asc,td.resource_name,o.order_srt desc;
            `, [vesselId, start, end]);
            let result = {};
            decklogs.forEach((element, idx)=>{
                if(result[element.order_srt]===undefined){
                    result[element.order_srt] = {
                        vesselName: element.vessel_name,
                        from: element.from_location,
                        to: element.to_location,
                        stages: []
                    }
                }
                if(result[element.order_srt].stages.length!==0){
                    result[element.order_srt].stages[result[element.order_srt].stages.length-1].end_stage = element.stage_name;
                    result[element.order_srt].stages[result[element.order_srt].stages.length-1].end_time = moment(element.stage_time).format('YYYY-MM-DD HH:mm:ss');
                }
                result[element.order_srt].stages.push({
                    start_stage: element.stage_name,
                    start_time: moment(element.stage_time).format('YYYY-MM-DD HH:mm:ss')
                })
            })
            Object.values(result).forEach(element=>{
                if(element.stages.length>1 && 
                    element.stages[element.stages.length-1].start_stage===element.stages[element.stages.length-2].end_stage && 
                    element.stages[element.stages.length-1].start_time===element.stages[element.stages.length-2].end_time
                ){
                    element.stages.pop()
                }
            })
            Object.values(result).forEach(e=>{
                console.log(e.stages)
            })
            return Object.values(result)
        }

        
    }
    async UnlockVesselReportPage(vesselId) {
        await this.sqlInterface.PerformQueryPromise(`
            UPDATE ${config.kstConfig.sqlTables.LOCK}
            SET pagelock = NULL
            WHERE vessel_id=$1 AND page='${pagekey}'
            RETURNING *;
        `,[vesselId])
        return true
    }
    async ListVesselReports(vesselId) {
        let vesselreports = await this.sqlInterface.PerformQueryPromise(`
            SELECT form_id as formid, form_date AS formdate, report_date as reportdate, file_path as filepath, shift, vessel_id, is_backdated as backdated, is_offline as offline
            FROM ${config.kstConfig.sqlTables.VESSELREPORTFORM}
            WHERE vessel_id = $1 
            ORDER BY form_date DESC;
        `,[vesselId]);
        vesselreports.forEach(element=>{
            element.reportDate = element.reportdate;
            delete element.reportdate;
        })
        return vesselreports;
    }
    async ListVesselReport(vesselId) {
        let vesselreports = await this.sqlInterface.PerformQueryPromise(`
            SELECT form_id 
            FROM ${config.kstConfig.sqlTables.VESSELREPORTFORM}
            WHERE vessel_id = $1
            ORDER BY form_date DESC;
        `,[vesselId])
        return await Promise.all(vesselreports.map((id) => {
            return this.GetVesselReport(id.form_id)
        }))
    }
    async ListVesselReportEligibleForPDF() {
        let vesselreports = await this.sqlInterface.PerformQueryPromise(`
            SELECT form_id, form_date AS formdate, report_date AS reportdate FROM ${config.kstConfig.sqlTables.VESSELREPORTFORM}
            WHERE file_path IS NULL 
            AND chief_engineer_signature IS NOT NULL AND chief_engineer_signature != ''
            AND chief_engineer_name IS NOT NULL AND chief_engineer_name != ''
            AND captain_signature IS NOT NULL AND captain_signature != ''
            AND captain_name IS NOT NULL AND captain_name != ''
            ORDER BY form_date DESC;
        `,[]);
        if (vesselreports instanceof Array && vesselreports.length > 0) {
            var reportsEligible = [];
            for (const row of vesselreports) {
                if (row.formdate) {
                    const report = await this.GetVesselReport(row.form_id);
                    report.formdate = moment(row.formdate).format('DD-MMM-YY');
                    reportsEligible.push(report);
                }
            }
            return reportsEligible;
        } else {
            return [];
        }
    }
    async GetVesselReport(reportId) {
        let vesselReports = await this.sqlInterface.GetDataFromTable(config.kstConfig.sqlTables.VESSELREPORTFORM, VESSELREPORTMAP, {form_id : reportId}, null)
        if (vesselReports instanceof Array && vesselReports.length > 0) {
            let vesselReport = vesselReports[0]
            vesselReport.crew = await this.GetVesselReportPageRelatedCrew(reportId)
            vesselReport.decklogs = await this.GetVesselReportPageRelatedData(reportId, config.kstConfig.sqlTables.DECKLOG, DECKLOGMAP, "order_priority")
            vesselReport.engines = await this.GetVesselReportPageRelatedData(reportId, config.kstConfig.sqlTables.VESSELREPORTENGINELOG, ELOGMAPPING, ELOGMAPPING.engineIdentifier.col)
            vesselReport.zpClutch = await this.GetVesselReportPageRelatedData(reportId, config.kstConfig.sqlTables.VESSELREPORTZPCLUTCH, ZPCLUTCH, ZPCLUTCH.identifier.col)
            vesselReport.generators = await this.GetVesselReportPageRelatedData(reportId, config.kstConfig.sqlTables.VESSELREPORTGENERATOR, GENERATORMAPPING, GENERATORMAPPING.generatorIdentifier.col)
            vesselReport.aircons = await this.GetVesselReportPageRelatedData(reportId, config.kstConfig.sqlTables.VESSELREPORTAC, ACMAP, ACMAP.identifier.col)
            return vesselReport
        } else {
            return null
        }
    }
    async GetVesselReportPageRelatedCrew(reportId) {
        let vesselReportCrews = await this.sqlInterface.PerformQueryPromise(`
            SELECT date, shift, crew_id, employee_no, name, rank, is_working
            FROM ${config.kstConfig.sqlTables.VESSELREPORTCREW}
            WHERE form_id=$1
        `,[reportId])
        return vesselReportCrews.map(dbcrew => {
            return {
                date: dbcrew.date,
                shift: dbcrew.shift,
                crewId : dbcrew.crew_id,
                employeeNo: dbcrew.employee_no,
                name : dbcrew.name,
                rank : dbcrew.rank,
                isWorking : dbcrew.is_working
            }
        })
    }
    async GetVesselReportPageRelatedData(reportId, tablename, mapping, orderByCol) {
        return await this.sqlInterface.GetDataFromTable( tablename, mapping, { form_id : reportId }, orderByCol)
    }
    /*
    shift : 1,2,
    vesselId : int,
    filepath : string,
    formDate : datetime,
    fuelOilConsumed : decimal,
    fuelOilRob : decimal,
    fwConsumed : decimal,
    fwRob : decimal,
    decklogs : [{
        startLocation : string,
        endLocation : string,
        starttime : datetime,
        endtime : datetime,
        status : string,
        typeOfJob : string,
        tugPosition : string,
        noOfTugs : decimal,
        order : int
    }],
    generators : [{
        foPressue : decimal,
        loPressure : decimal, 
        loTemp : decimal, 
        loLevel : string, 
        coolingWaterTempIn : decimal, 
        coolingWaterTempOut : decimal, 
        exhaustTemp : decimal,
        generatorIdentifier : string,
    }],
    engines : [{
        engineIdentifier : string,
        runningHour : decimal,
        rpm : decimal,
        propellerRpm : decimal,
        cppPitch : decimal?,
        fuelrack : string,
        lubOilPressure : decimal,
        freshwaterPressure : decimal,
        seawaterPressure : decimal,
        chargeAirPressure : decimal,
        turboChargerLubOilPressure : decimal, 
        fuelOilPressure : decimal,
        lubOilPressureBfCooler : decimal,
        lubOilPressureAfCooler : decimal, 
        freshwaterTempIn : decimal, 
        freshwaterTempOut : decimal,
        seawaterTempIn : decimal,
        seawaterTempOut : decimal,
        turboChargerRpm : decimal, 
        turboChargerExhaustTempIn : decimal, 
        turboChargerExhaustTempOut : decimal, 
        chargeAirTemp : decimal, 
        cylinder1PeakPressure : decimal,
        cylinder1ExhaustTemp : decimal,
        cylinder2PeakPressure : decimal,
        cylinder2ExhaustTemp : decimal,
        cylinder3PeakPressure : decimal,
        cylinder3ExhaustTemp : decimal,
        cylinder4PeakPressure : decimal,
        cylinder4ExhaustTemp : decimal,
        cylinder5PeakPressure : decimal,
        cylinder5ExhaustTemp : decimal,
        cylinder6PeakPressure : decimal,
        cylinder6ExhaustTemp : decimal,
        cylinder7PeakPressure : decimal,
        cylinder7ExhaustTemp : decimal,
        cylinder8PeakPressure : decimal,
        cylinder8ExhaustTemp : decimal,
    }],
    zpClutch : [{
        identifier : string,
        zpLoLevel : string,
        zpLoPressure : decimal,
        zpChargeOilPressure : decimal,
        zpLoTemp : decimal,
        zpHoLevel : string,
        zpHoTempIn : decimal,
        zpHoTempOut : decimal,
        clutchOilPressure : decimal,
    }],
    crew : [{
        crewId : int,
        isWorking : bool,
    }],
    runninghours : [{
        carryForward : decimal,
        total : decimal,
        identifier : string    
    }],
    powerreadings : [{
        identifier : string,
        voltage : decimal,
        frequency : decimal, 
        current : decimal, 
        power : decimal, 
    }],
    aircons : [{
        identifier : string,
        compressorCurrent : decimal,
        compressorSuctionPressure : decimal, 
        compressorDischargePressure : decimal, 
        loPressure : decimal, 
        coolingWaterPressure : decimal,
        coolingWaterTemp : decimal,
    }],
    rob : [{
        identifier : string,
        received : decimal,
        consumed :  decimal,
        rob :  decimal
    }],
    tanksoundings : [{
        identifier : string,
        level_reading : decimal,
        volume :  decimal,
    }]
    */
    async CreateVesselReport(vesselreport) {
        delete vesselreport.formDate;
        if (vesselreport.is_backdated === false && helper.IsEmpty(vesselreport.platform)) {
            const TIMEZONE = config.TIMEZONE;
            let timeStampToUse = moment.tz(new Date(), TIMEZONE);
            if(moment.tz(new Date(), TIMEZONE).isBefore(
                moment.tz(new Date(), TIMEZONE).set('hour', 8).set('minute', 30).set('second', 0).set('millisecond', 0)
            )){
                timeStampToUse.subtract(1, 'day');
            }
            vesselreport.reportDate = timeStampToUse.format('DD-MM-YYYY');
        }
        await this.multipleVesselReportsInSameDateCheck(vesselreport);
        let dbVesselReport = await this.sqlInterface.InsertRow(vesselreport,VESSELREPORTMAP,config.kstConfig.sqlTables.VESSELREPORTFORM)
        let vesselReportId = dbVesselReport.form_id
        if (vesselreport.crew && vesselreport.crew instanceof Object) {
            await this.InsertVesselReportCrewData(vesselreport.crew,vesselReportId, vesselreport.reportDate, vesselreport.shift)
        }
        // if (vesselreport.decklogs instanceof Array && vesselreport.decklogs.length > 0) {
        //     await this.InsertVesselReportRelatedData(vesselreport.decklogs, DECKLOGMAP, config.kstConfig.sqlTables.DECKLOG, vesselReportId, true)
        // }
        if (vesselreport.engines instanceof Array && vesselreport.engines.length > 0) {
            await this.InsertVesselReportRelatedData(vesselreport.engines, ELOGMAPPING, config.kstConfig.sqlTables.VESSELREPORTENGINELOG, vesselReportId)
        }
        if (vesselreport.zpClutch instanceof Array && vesselreport.zpClutch.length > 0) {
            await this.InsertVesselReportRelatedData(vesselreport.zpClutch, ZPCLUTCH, config.kstConfig.sqlTables.VESSELREPORTZPCLUTCH, vesselReportId)
        }
        if (vesselreport.generators instanceof Array && vesselreport.generators.length > 0) {
            await this.InsertVesselReportRelatedData(vesselreport.generators, GENERATORMAPPING, config.kstConfig.sqlTables.VESSELREPORTGENERATOR, vesselReportId)
        }
        if (vesselreport.aircons instanceof Array && vesselreport.aircons.length > 0) {
            await this.InsertVesselReportRelatedData(vesselreport.aircons, ACMAP, config.kstConfig.sqlTables.VESSELREPORTAC, vesselReportId)
        }
        vesselreport.formId = vesselReportId
        return vesselreport
    }
    async multipleVesselReportsInSameDateCheck(vesselReport) {
        try {
            await this.sqlInterface.PerformQueryPromise(
            `UPDATE ${config.kstConfig.sqlTables.VESSELREPORTFORM}
                            SET is_redundant = true
                            WHERE shift = $1 and report_date=$2 and vessel_id=$3;
                `,
            [vesselReport.shift, vesselReport.reportDate, vesselReport.vesselId]
            );
        } catch (error) {
          throw new Error(error);
        }
    }
    async UpdateVesselReportFilePath(reportId, filepath) {
        var update = {
            file_path : filepath
        }
        let vesselreport = await this.sqlInterface.PerformUpdatePromise(
            config.kstConfig.sqlTables.VESSELREPORTFORM,
            update,
            {form_id : reportId})
        return vesselreport
    }
    async InsertVesselReportCrewData(crewlist, formId, date, shift) {
        var insertList = [];
        if(crewlist.working instanceof Array && crewlist.working.length > 0){
            crewlist.working.forEach(crew=>{
                let newcrew={
                    crew_id : crew.crewId,
                    name: crew.name,
                    rank: crew.rank,
                    is_working : crew.isWorking,
                    employee_no: crew.employeeNo,
                    form_id : formId,
                    date: date,
                    shift: shift
                }
                insertList.push(newcrew)
            })
        }
        if(crewlist.resting && crewlist.resting instanceof Array && crewlist.resting.length > 0){
            crewlist.resting.forEach(crew=>{
                let newcrew={
                    crew_id : crew.crewId,
                    employee_no: crew.employeeNo,
                    name: crew.name,
                    rank: crew.rank,
                    is_working : crew.isWorking,
                    form_id : formId,
                    date: date,
                    shift: shift
                }
                insertList.push(newcrew)
            })
        }
        return await this.sqlInterface.PerformBatchInsertPromise(config.kstConfig.sqlTables.VESSELREPORTCREW,insertList)
    }
    async InsertVesselReportRelatedData(datarows, mapping, tablename, formId, isOrdered = false) {
        if (datarows instanceof Array && datarows.length > 0) {
            var insertList = []
            datarows.forEach((log,i) => {
                let temp_log = {
                    form_id : formId
                }
                if (isOrdered) {
                    temp_log.order_priority = i
                }
                Object.keys(mapping).forEach(key => {
                    temp_log[mapping[key].col] = log[key]
                })
                insertList.push(temp_log)
            })
            return await this.sqlInterface.PerformBatchInsertPromise(tablename,insertList)
        } else {
            return []
        }
    }
    /*Not Used*/
    async GetCrewVesselReports(start,end,crewId) {
        let rows = await this.sqlInterface.PerformQueryPromise(`
        SELECT 
            vc.crew_id, c.name, vf.${VESSELREPORTMAP.shift.col}, vf.${VESSELREPORTMAP.formDate.col},  vc.is_working 
        FROM ${config.kstConfig.sqlTables.VESSELREPORTFORM} AS vf
        JOIN ${config.kstConfig.sqlTables.VESSELREPORTCREW} AS vc ON vc.form_id = vf.form_id
        JOIN ${config.kstConfig.sqlTables.CREW} AS c ON c.crew_id = vc.crew_id
        WHERE vc.crew_id = $1 AND vf.${VESSELREPORTMAP.formDate.col} >= $2 AND vf.${VESSELREPORTMAP.formDate.col} <= $3
        `,[crewId,start,end])
        return rows.map(row => {
            return {
                crewId : row.crew_id,
                name : row.name,
                shift : row[VESSELREPORTMAP.shift.col],
                formDate : row[VESSELREPORTMAP.formDate.col],
                isWorking : row.is_working
            }
        })
    }

    async fetchShiftBackDatedDataByReportDate(vesselId, reportDate) {
        try {
          const status = "pending";
          var queryResponse = await this.sqlInterface.PerformQueryPromise(
            `
              select a.form,a.report_date as reportdate from ${config.kstConfig.sqlTables.AUTHORIZEDBACKDATEDVESSELREPORTFORM} as a
              where a.status=$1 and a.vessel_id=$2 and a.report_date=$3
              `,
            [status, vesselId,reportDate]
          );
    
          return queryResponse;
        } catch (error) {
          throw new Error(error);
        }
    }

    async getVesselReportFormStructure(vesselId,dailyLogApi) {
        try {
            var valueCount = 30;
            var ackStyleValueArray = [];
            var engStyleValueArray = [];
            for (var i = 0; i < valueCount; i++) {
                ackStyleValueArray.push({ value: '', style: ACKNOWLEDGEMENTSTYLE });
            };
            for (var i = 0; i < valueCount; i++) {
                engStyleValueArray.push({ value: '', style: ENGINERUNNINGHOURSTYLE });
            };

            //Array for send back to client with excel data's to generate
            var excelDataStructure = [];
            // Acknowledgement data form starts
            const acknowledgementStructure = await this.sqlInterface.PerformQueryPromise(
                `
                select v.report,v.category,v.tag_name as tagname,v.display_name as displayname,v.unit,v.order_by as orderid
                from ${config.kstConfig.sqlTables.VESSELREPORTFORMSTRUCTURE} as v
                where category=$1 and is_lng=false order by orderid asc
                `,[EXCELGENERATECATEGORY.ACKNOWLEDGEMENTS]
            );

            if (acknowledgementStructure && acknowledgementStructure.length > 0) {
                acknowledgementStructure.forEach(aStructure => {
                    excelDataStructure.push(
                        [
                            { value: aStructure.report,style: ACKNOWLEDGEMENTSTYLE },
                            { value: aStructure.category,style: ACKNOWLEDGEMENTSTYLE },
                            { value: aStructure.tagname,style: ACKNOWLEDGEMENTSTYLE },
                            { value: '-',style: ACKNOWLEDGEMENTSTYLE},
                            { value: aStructure.displayname,style: ACKNOWLEDGEMENTSTYLE },
                            { value: aStructure.unit, style: ACKNOWLEDGEMENTSTYLE },
                            ...ackStyleValueArray
                        ],
                    );
                })
            }
            // Acknowledgement data form ends

            // Engine runninng hour data form starts
            const engineRunningHourStructure = await this.sqlInterface.PerformQueryPromise(
              `
              select v.report,v.category,v.tag_name as tagname,v.display_name as displayname,v.unit,v.is_lng as lng
              from ${config.kstConfig.sqlTables.VESSELREPORTFORMSTRUCTURE} as v
              where category=$1 and ${vesselId === 10 || vesselId === 11 ? 'is_lng in (true,false)' : 'is_lng=false'}
              `,[EXCELGENERATECATEGORY.ENGINERUNNINGHOURS]
            );
            const engineRunningHourFields = await dailyLogApi.GetGeneratorStructure(vesselId);

            if (engineRunningHourStructure && engineRunningHourStructure.length > 0 && engineRunningHourFields && engineRunningHourFields.length > 0) {
                engineRunningHourFields.unshift(
                    { generator_identifier: 'S' },
                    { generator_identifier: 'P' },
                );

                engineRunningHourFields.forEach(eField => {
                    engineRunningHourStructure.forEach(eStructure => {
                        if (eField.generator_identifier.includes("AE") && eStructure.lng === true) {
                            return;
                        }
                        excelDataStructure.push(
                            [
                                { value: eStructure.report,style: ENGINERUNNINGHOURSTYLE },
                                { value: eStructure.category,style: ENGINERUNNINGHOURSTYLE },
                                { value: eStructure.tagname,style: ENGINERUNNINGHOURSTYLE },
                                { value: eField.generator_identifier,style: ENGINERUNNINGHOURSTYLE },
                                { value: (eField.generator_identifier === 'S' || eField.generator_identifier === 'P' ? eField.generator_identifier+'.Main Engine': eField.generator_identifier) + ' ' + eStructure.displayname,style: ENGINERUNNINGHOURSTYLE },
                                { value: eStructure.unit,style: ENGINERUNNINGHOURSTYLE },
                                ...engStyleValueArray
                            ],
                        );
                    });
                });
            }
            // Engine runninng hour data form ends

            // ROB data form starts
            const robStructure = await this.sqlInterface.PerformQueryPromise(
                `
                select v.report,v.category,v.tag_name as tagname,v.display_name as displayname,v.unit
                from ${config.kstConfig.sqlTables.VESSELREPORTFORMSTRUCTURE} as v
                where category=$1 and is_lng=false
                `,[EXCELGENERATECATEGORY.CONSUMABLESROB]
            );
            const robFields = await dailyLogApi.GetRobStructure(vesselId);

            if (robStructure && robStructure.length > 0 && robFields && robFields.length > 0) {
                robFields.forEach(rField => {
                    robStructure.forEach(rStructure => {
                        excelDataStructure.push(
                            [
                                { value: rStructure.report,style: ACKNOWLEDGEMENTSTYLE },
                                { value: rStructure.category,style: ACKNOWLEDGEMENTSTYLE },
                                { value: rStructure.tagname,style: ACKNOWLEDGEMENTSTYLE },
                                { value: rField.rob_identifier,style: ACKNOWLEDGEMENTSTYLE},
                                { value: rField.rob_identifier + ' ' + rStructure.displayname,style: ACKNOWLEDGEMENTSTYLE },
                                { value: rStructure.unit,style: ACKNOWLEDGEMENTSTYLE },
                                ...ackStyleValueArray
                            ],
                        );
                    })
                })
            }
            // ROB data form ends

            // Tank soundings data form ends
            const tankSoundingStructure = await this.sqlInterface.PerformQueryPromise(
                `
                select v.report,v.category,v.tag_name as tagname,v.display_name as displayname,v.unit
                from ${config.kstConfig.sqlTables.VESSELREPORTFORMSTRUCTURE} as v
                where category=$1 and is_lng=false
                `,[EXCELGENERATECATEGORY.TANKSOUNDINGS]
            );
            const tankSoundingFields = await dailyLogApi.GetTankSounding(vesselId);

            if (tankSoundingStructure && tankSoundingStructure.length > 0 && tankSoundingFields && tankSoundingFields.length > 0) {
                tankSoundingFields.forEach(tField => {
                    tankSoundingStructure.forEach(tStructure => {
                        excelDataStructure.push(
                            [
                                { value: tStructure.report,style: ENGINERUNNINGHOURSTYLE },
                                { value: tStructure.category,style: ENGINERUNNINGHOURSTYLE },
                                { value: tStructure.tagname,style: ENGINERUNNINGHOURSTYLE },
                                { value: tField.identifier,style: ENGINERUNNINGHOURSTYLE },
                                { value: tField.identifier,style: ENGINERUNNINGHOURSTYLE },
                                { value: tStructure.unit === 'M' ? tStructure.unit+ ' ('+tField.max_depth+'m)' : tStructure.unit+ ' ('+tField.max_volume+'m³)',style: ENGINERUNNINGHOURSTYLE },
                                ...engStyleValueArray
                            ],
                        );
                    })
                })
            }
            const version = await this.sqlInterface.PerformQueryPromise(`
                SELECT tag_name from ${config.kstConfig.sqlTables.VESSELREPORTFORMSTRUCTURE} where report='Daily Log' AND category='Version'
                `,[]
              );
              if(version instanceof Array && version.length>0){
                  excelDataStructure.push([
                    { value: "Version" },
                    { value: version[0].tag_name },
                ])
              }
            // Tank soundings data form ends
            return excelDataStructure;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getVesselReportShiftLogFormStructure(vesselId,SHIFT) {
        try {
            const CREWCATEGORY = "Crew On Board";
            var valueCount = 30;
            var ackStyleValueArray = [];
            var engStyleValueArray = [];
            for (var i = 0; i < valueCount; i++) {
                ackStyleValueArray.push({ value: '', style: ACKNOWLEDGEMENTSTYLE });
            };
            for (var i = 0; i < valueCount; i++) {
                engStyleValueArray.push({ value: '', style: ENGINERUNNINGHOURSTYLE });
            };

            //Array for send back to client with excel data's to generate
            var excelDataStructure = [];
            // Acknowledgement data form starts
            const acknowledgementStructure = await this.sqlInterface.PerformQueryPromise(
                `
                select v.report,v.category,v.tag_name as tagname,v.display_name as displayname,v.unit,v.order_by as orderid
                from ${config.kstConfig.sqlTables.VESSELREPORTFORMSTRUCTURE} as v
                where category=$1 and is_lng=false order by orderid asc
                `,[EXCELGENERATECATEGORY.ACKNOWLEDGEMENTS]
            );

            if (acknowledgementStructure && acknowledgementStructure.length > 0) {
                acknowledgementStructure.forEach(aStructure => {
                    excelDataStructure.push(
                        [
                            { value: SHIFT,style: ENGINERUNNINGHOURSTYLE },
                            { value: aStructure.category,style: ENGINERUNNINGHOURSTYLE },
                            { value: aStructure.tagname,style: ENGINERUNNINGHOURSTYLE },
                            { value: '-',style: ENGINERUNNINGHOURSTYLE},
                            { value: aStructure.displayname,style: ENGINERUNNINGHOURSTYLE },
                            { value: aStructure.unit, style: ENGINERUNNINGHOURSTYLE },
                            ...engStyleValueArray
                        ],
                    );
                })
            }
            // Acknowledgement data form ends
            // Crew data form starts
            var crewOnBoardList = await this.GetCrewData(vesselId);
            if (crewOnBoardList && crewOnBoardList.length > 0) {
                crewOnBoardList = crewOnBoardList.filter(crew => (crew.rank && crew.employee_no && crew.name));
                crewOnBoardList.forEach(crew => {
                    excelDataStructure.push(
                        [
                            { value: SHIFT, style: ACKNOWLEDGEMENTSTYLE },
                            { value: CREWCATEGORY, style: ACKNOWLEDGEMENTSTYLE },
                            { value: (crew.crew_id+"_"+crew.employee_no+"_"+crew.rank), style: ACKNOWLEDGEMENTSTYLE },
                            { value: "-", style: ACKNOWLEDGEMENTSTYLE },
                            { value: crew.name, style: ACKNOWLEDGEMENTSTYLE },
                            { value: "Working/Resting", style: ACKNOWLEDGEMENTSTYLE },
                            ...ackStyleValueArray
                        ]
                    );
                })
            }
            // Crew data form ends

            // // Deck Log data form starts
            // const deckLogStructure = await this.sqlInterface.PerformQueryPromise(
            //     `
            //     select v.report,v.category,v.tag_name as tagname,v.display_name as displayname,v.unit,v.order_by as orderid
            //     from ${config.kstConfig.sqlTables.VESSELREPORTFORMSTRUCTURE} as v
            //     where category=$1 and is_lng=false order by orderid asc
            //     `,[EXCELGENERATECATEGORY.DECKLOG]
            // );

            // if (deckLogStructure && deckLogStructure.length > 0) {
            //     deckLogStructure.forEach(dStructure => {
            //         excelDataStructure.push(
            //             [
            //                 { value: SHIFT,style: ACKNOWLEDGEMENTSTYLE },
            //                 { value: dStructure.category,style: ACKNOWLEDGEMENTSTYLE },
            //                 { value: dStructure.tagname,style: ACKNOWLEDGEMENTSTYLE },
            //                 { value: '-',style: ACKNOWLEDGEMENTSTYLE},
            //                 { value: dStructure.displayname,style: ACKNOWLEDGEMENTSTYLE },
            //                 { value: dStructure.unit, style: ACKNOWLEDGEMENTSTYLE },
            //                 ...ackStyleValueArray
            //             ],
            //         );
            //     })
            // }
            // // Deck Log data form ends

            // Engines data form starts
            const enginesStructure = await this.sqlInterface.PerformQueryPromise(
                `
                select v.report,v.category,v.tag_name as tagname,v.display_name as displayname,v.unit,v.order_by as orderid
                from ${config.kstConfig.sqlTables.VESSELREPORTFORMSTRUCTURE} as v where category=$1 order by orderid asc
                `,[EXCELGENERATECATEGORY.ENGINES]
              );
              const enginesIdentifiers = ['S','P'];
  
              if (enginesStructure && enginesStructure.length > 0) {
  
                enginesIdentifiers.forEach(eField => {
                    enginesStructure.forEach(eStructure => {
                          excelDataStructure.push(
                              [
                                  { value: SHIFT,style: ENGINERUNNINGHOURSTYLE },
                                  { value: eStructure.category,style: ENGINERUNNINGHOURSTYLE },
                                  { value: eStructure.tagname,style: ENGINERUNNINGHOURSTYLE },
                                  { value: eField,style: ENGINERUNNINGHOURSTYLE },
                                  { value: eField+' '+ eStructure.displayname,style: ENGINERUNNINGHOURSTYLE },
                                  { value: eStructure.unit,style: ENGINERUNNINGHOURSTYLE },
                                  ...engStyleValueArray
                              ],
                          );
                      });
                  });
              }
              // Engines data form ends
            
            // Generators data form starts
            const generatorStructure = await this.sqlInterface.PerformQueryPromise(
                `
                select v.report,v.category,v.tag_name as tagname,v.display_name as displayname,v.unit,v.order_by as orderid
                from ${config.kstConfig.sqlTables.VESSELREPORTFORMSTRUCTURE} as v where category=$1 order by orderid asc
                `,[EXCELGENERATECATEGORY.GENERATORS]
              );
              const generatorFields = await this.GetGeneratorStructure(vesselId);
  
              if (generatorStructure && generatorStructure.length > 0 && generatorFields && generatorFields.length > 0) {
  
                  generatorFields.forEach(gField => {
                      generatorStructure.forEach(gStructure => {
                          excelDataStructure.push(
                              [
                                  { value: SHIFT,style: ACKNOWLEDGEMENTSTYLE },
                                  { value: gStructure.category,style: ACKNOWLEDGEMENTSTYLE },
                                  { value: gStructure.tagname,style: ACKNOWLEDGEMENTSTYLE },
                                  { value: gField.generator_identifier,style: ACKNOWLEDGEMENTSTYLE },
                                  { value: gField.generator_identifier + ' ' + gStructure.displayname,style: ACKNOWLEDGEMENTSTYLE },
                                  { value: gStructure.unit,style: ACKNOWLEDGEMENTSTYLE },
                                  ...ackStyleValueArray
                              ],
                          );
                      });
                  });
              }
              // Generators data form ends

            // Azimuth Thruster data form starts
            const azimuthStructure = await this.sqlInterface.PerformQueryPromise(
                `
                select v.report,v.category,v.tag_name as tagname,v.display_name as displayname,v.unit,v.order_by as orderid
                from ${config.kstConfig.sqlTables.VESSELREPORTFORMSTRUCTURE} as v where category=$1 order by orderid asc
                `,[EXCELGENERATECATEGORY.AZIMUTHTHRUSTER]
              );
              const azimuthIdentifiers = ['S','P'];
  
              if (azimuthStructure && azimuthStructure.length > 0) {
  
                azimuthIdentifiers.forEach(aField => {
                    azimuthStructure.forEach(aStructure => {
                          excelDataStructure.push(
                              [
                                  { value: SHIFT,style: ENGINERUNNINGHOURSTYLE },
                                  { value: aStructure.category,style: ENGINERUNNINGHOURSTYLE },
                                  { value: aStructure.tagname,style: ENGINERUNNINGHOURSTYLE },
                                  { value: aField,style: ENGINERUNNINGHOURSTYLE },
                                  { value: aField+' '+ aStructure.displayname,style: ENGINERUNNINGHOURSTYLE },
                                  { value: aStructure.unit,style: ENGINERUNNINGHOURSTYLE },
                                  ...engStyleValueArray
                              ],
                          );
                      });
                  });
              }
              // Azimuth Thruster data form ends

            // Air Conditioning data form starts
            const airConditioningStructure = await this.sqlInterface.PerformQueryPromise(
                `
                select v.report,v.category,v.tag_name as tagname,v.display_name as displayname,v.unit,v.order_by as orderid
                from ${config.kstConfig.sqlTables.VESSELREPORTFORMSTRUCTURE} as v where category=$1 order by orderid asc
                `,[EXCELGENERATECATEGORY.AIRCONDITIONING]
              );
  
              if (airConditioningStructure && airConditioningStructure.length > 0) {
                    airConditioningStructure.forEach(aStructure => {
                        excelDataStructure.push(
                            [
                                { value: SHIFT,style: ACKNOWLEDGEMENTSTYLE },
                                { value: aStructure.category,style: ACKNOWLEDGEMENTSTYLE },
                                { value: aStructure.tagname,style: ACKNOWLEDGEMENTSTYLE },
                                { value: '-',style: ACKNOWLEDGEMENTSTYLE },
                                { value: aStructure.displayname,style: ACKNOWLEDGEMENTSTYLE },
                                { value: aStructure.unit,style: ACKNOWLEDGEMENTSTYLE },
                                ...ackStyleValueArray
                            ],
                        );
                    });
              }
              // Air Conditioning data form ends
              const version = await this.sqlInterface.PerformQueryPromise(`
                SELECT tag_name from ${config.kstConfig.sqlTables.VESSELREPORTFORMSTRUCTURE} where report='Shift Log' AND category='Version'
                `,[]
              );
              if(version instanceof Array && version.length>0){
                  excelDataStructure.push([
                    { value: "Version" },
                    { value: version[0].tag_name },
                ])
              }
            return excelDataStructure;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getPreviousDateMissingSubmissionVRFDLData(reportDate) {
        try {
            const [MORNING_SHIFT,EVENING_SHIFT,DAILY_LOG] = ["MORNINGSHIFT","EVENINGSHIFT","DAILYLOG"];
            let tempObj = {
                reportDate: reportDate,
                isEligibleToMail: false,
                //mr stands for morningShift,ev standa for evening shift and dl for daily log. [Sorry for this awkward namings]
                mr: [],
                ev: [],
                dl: []
            };

            const pendingSubmissionList = await this.sqlInterface.PerformQueryPromise(`
                SELECT b.id,b.vessel_id as "vesselID",v.name as "vesselName",b.form,b.status,b.report_date as "reportDate" from 
                ${config.kstConfig.sqlTables.AUTHORIZEDBACKDATEDVESSELREPORTFORM} as b left join ${config.kstConfig.sqlTables.VESSEL} as v 
                ON v.vessel_id = b.vessel_id where status = $2 and TO_DATE(report_date,'DD-MM-YYYY') = TO_DATE($1,'DD-MM-YYYY')
            `,[reportDate,PENDING_STATUS]);

            if(pendingSubmissionList instanceof Array && pendingSubmissionList.length > 0) {
                for(let submission of pendingSubmissionList) {
                    switch (submission.form) {
                        case MORNING_SHIFT : {
                            tempObj.mr.push({v: submission.vesselName})
                            break;
                        }
                        case EVENING_SHIFT : {
                            tempObj.ev.push({v: submission.vesselName})
                            break;
                        }
                        case DAILY_LOG : {
                            tempObj.dl.push({v: submission.vesselName})
                            break;
                        }
                    }
                }
                tempObj.isEligibleToMail = true;
                return tempObj;
            }
            return tempObj;
        } catch (error) {
            throw new Error(error);
        }
    }

    //
    async getPreviousDateMissingSubmissionVRFDLDataConsolidated(reportDate) {
        try {
            const [MORNING_SHIFT,EVENING_SHIFT,DAILY_LOG] = ["MORNINGSHIFT","EVENINGSHIFT","DAILYLOG"];
            let tempObj = {
                //reportDate: reportDate,
                isEligibleToMail: false,
                //mr stands for morningShift,ev standa for evening shift and dl for daily log. [Sorry for this awkward namings]
                mr: [],
                ev: [],
                dl: []
            };

            const pendingSubmissionList = await this.sqlInterface.PerformQueryPromise(`
                SELECT b.id,b.vessel_id as "vesselID",v.name as "vesselName",b.form,b.status,b.report_date as "reportDate" from 
                ${config.kstConfig.sqlTables.AUTHORIZEDBACKDATEDVESSELREPORTFORM} as b left join ${config.kstConfig.sqlTables.VESSEL} as v 
                ON v.vessel_id = b.vessel_id where status = $2 GROUP BY report_date
            `,[PENDING_STATUS]);

            if(pendingSubmissionList instanceof Array && pendingSubmissionList.length > 0) {
                for(let submission of pendingSubmissionList) {
                    switch (submission.form) {
                        case MORNING_SHIFT : {
                            tempObj.mr.push({v: submission.vesselName})
                            break;
                        }
                        case EVENING_SHIFT : {
                            tempObj.ev.push({v: submission.vesselName})
                            break;
                        }
                        case DAILY_LOG : {
                            tempObj.dl.push({v: submission.vesselName})
                            break;
                        }
                    }
                }
                tempObj.isEligibleToMail = true;
                return tempObj;
            }
            return tempObj;
        } catch (error) {
            throw new Error(error);
        }
    }

}
module.exports = {
    service : new VesselReportService(),
    mappings : {
        elog : ELOGMAPPING,
        zpclutch : ZPCLUTCH,
        decklog : DECKLOGMAP,
        generator : GENERATORMAPPING,
        aircon : ACMAP,
        vesselreport : VESSELREPORTMAP,
        rob : ROBMAP,
        tanksounding : TANKSOUNDINGMAP
    },
    identifiers : {
        ZPCLUTCHIDENTIFIERS,
        ENGINEIDENTIFIERS,
        GENERATORIDENTIFIERS,
        ACIDENTIFIER,
        ROBIDENTIFERS,
        TANKSOUNDINGIDENTIFIERS
    }
}