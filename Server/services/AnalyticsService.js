const config = require('../config/config')
const helperWithoutApi = require('../helper/helperWithoutApi')
const {interfaceObj} = require("./interfaces/PostGreSQLInterface")
// const helper = require('../helper/helper.js');

var moment = require('moment');


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
}


const ROBMAP = {
    identifier :  { col : "identifier", type: "string" },
    carryForward: { col : "carry_forward_rob", type: 'decimal' },
    received :  { col : "received", type: "decimal" },
    consumed :  { col : "consumed", type: "decimal" },
    rob :  { col : "rob", type: "decimal" },
}

const TANKSOUNDINGMAP = {
    identifier :  { col : "identifier", type: "string" },
    level :  { col : "level_reading", type: "decimal" },
    volume :  { col : "volume", type: "decimal" },
}

const ELOGMAPPING = {
    engineIdentifier : { col : "engine_identifier", type: "string" },
    carryForwardRunningHour: {col: "carry_forward_running_hour", type: 'decimal'},
    runningHour : {col: "running_hour", type: 'decimal'},
    LNGcarryForwardRunningHour: {col: "lng_carry_forward_running_hour", type: 'decimal'},
    LNGrunningHour : {col: "lng_running_hour", type: 'decimal'},
    totalRunningHour:  {col: "total_running_hour", type: 'decimal'},
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

const GENERATORMAPPING = {
    generatorIdentifier : { col : "generator_identifier", type: "string" },
    carryForwardRunningHour: {col: "carry_forward_running_hour", type: 'decimal'},
    runningHour : {col: "running_hour", type: 'decimal'},
    totalRunningHour:  {col: "total_running_hour", type: 'decimal'},
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

const ZPCLUTCH = {
    identifier : { col : "zpclutch_identifier", type: "string" },
    zpLoLevel : { col : "zp_lub_oil_level", type: "decimal" },
    zpLoPressure : { col : "zp_lub_oil_pressure", type: "decimal" },
    zpChargeOilPressure :   { col : "zp_charge_oil_pressure", type: "decimal" },
    zpLoTemp : { col : "zp_lub_oil_temp", type: "decimal" },
    zpHoLevel : { col : "zp_h_oil_level", type: "text" },
    zpHoTempIn : { col : "zp_h_oil_temp_in", type: "decimal" },
    zpHoTempOut : { col : "zp_h_oil_temp_out", type: "decimal" },
    clutchOilPressure : { col : "clutch_oil_pressure", type: "decimal" },
    zpRemarks: {col: 'remarks', type: 'string'}
}

"use strict";
class AnalyticsService {
    constructor () {
        this.sqlInterface = interfaceObj
    }

    async GetAllTags(vesselID) {
        let isRedundant = false;
        let inputs = [{
            name : "vesselID",
            //type : sql.VarChar(255),
            value : vesselID
        }]

        // let vesselreports = await this.sqlInterface.PerformQueryPromise(`
        //     SELECT form_id 
        //     FROM ${config.kstConfig.sqlTables.VESSELREPORTFORM}
        //     WHERE vessel_id = $1
        //     ORDER BY form_date DESC;
        // `,[vesselID])

        // let formIds=[]
        // if (vesselreports instanceof Array && vesselreports.length > 0) {
        //     for (const row of vesselreports){
        //         formIds.push(row.form_id)
        //     }
        // } 
       
        let allTagList = await this.sqlInterface.PerformQueryPromise(`
        (SELECT distinct identifier||'_'||
            unnest(array['carry_forward_rob','received','consumed','rob']) AS "tagName",
            'ROB' as TAB ,
            unnest(array['carry_forward_rob','received','consumed','rob']) AS "tagIdentifier" 
            FROM vessel_report_rob WHERE form_id IN (select form_id from vessel_report_form where vessel_id=$1 AND is_redundant = ${isRedundant})
            ORDER BY "tagName"  )
            UNION ALL 
            (SELECT distinct identifier||'_'||
            unnest(array['level_reading','volume']) AS "tagName",
            'TANK' as TAB ,
            unnest(array['level_reading','volume']) AS "tagIdentifier" 
            FROM vessel_report_tank_sounding WHERE form_id IN (select form_id from vessel_report_form where vessel_id=$1 AND is_redundant = ${isRedundant})
            ORDER BY "tagName" )
            UNION ALL 
            (SELECT distinct engine_identifier||'_'||
            unnest(array['carry_forward_running_hour','running_hour','lng_carry_forward_running_hour','lng_running_hour','total_running_hour','rpm','propeller_rpm','cpp_pitch','lub_oil_pressure','freshwater_pressure','seawater_pressure','charge_air_pressure','turbo_charger_lub_oil_pressure','fuel_oil_pressure','lub_oil_temp_bf_cooler','lub_oil_temp_af_cooler','freshwater_temp_in','freshwater_temp_out','seawater_temp_in','seawater_temp_out','turbocharger_rpm','turbocharger_exhaust_temp_in','turbocharger_exhaust_temp_out','charge_air_temp','cylinder1_peak_pressure','cylinder1_exhaust_temp','cylinder2_peak_pressure','cylinder2_exhaust_temp','cylinder3_peak_pressure','cylinder3_exhaust_temp','cylinder4_peak_pressure','cylinder4_exhaust_temp','cylinder5_peak_pressure','cylinder5_exhaust_temp','cylinder6_peak_pressure','cylinder6_exhaust_temp','cylinder7_peak_pressure','cylinder7_exhaust_temp','cylinder8_peak_pressure','cylinder8_exhaust_temp']) 
            AS "tagName" ,'ENGINE' as TAB,
            unnest(array['carry_forward_running_hour','running_hour','lng_carry_forward_running_hour','lng_running_hour','total_running_hour','rpm','propeller_rpm','cpp_pitch','lub_oil_pressure','freshwater_pressure','seawater_pressure','charge_air_pressure','turbo_charger_lub_oil_pressure','fuel_oil_pressure','lub_oil_temp_bf_cooler','lub_oil_temp_af_cooler','freshwater_temp_in','freshwater_temp_out','seawater_temp_in','seawater_temp_out','turbocharger_rpm','turbocharger_exhaust_temp_in','turbocharger_exhaust_temp_out','charge_air_temp','cylinder1_peak_pressure','cylinder1_exhaust_temp','cylinder2_peak_pressure','cylinder2_exhaust_temp','cylinder3_peak_pressure','cylinder3_exhaust_temp','cylinder4_peak_pressure','cylinder4_exhaust_temp','cylinder5_peak_pressure','cylinder5_exhaust_temp','cylinder6_peak_pressure','cylinder6_exhaust_temp','cylinder7_peak_pressure','cylinder7_exhaust_temp','cylinder8_peak_pressure','cylinder8_exhaust_temp']) 
            AS "tagIdentifier"
            FROM vessel_report_enginelog WHERE form_id IN (select form_id from vessel_report_form where vessel_id=$1 AND is_redundant = ${isRedundant})
            ORDER BY "tagName"  ) 
            UNION ALL 
            (SELECT distinct generator_identifier||'_'||
            unnest(array['carry_forward_running_hour','running_hour','total_running_hour','voltage','frequency','current','power','fo_pressure','lo_pressure','lo_temperature','cooling_water_temp_in','cooling_water_temp_out','exhaust_temp']) AS "tagName",
            'ENGINE' as TAB, 
            unnest(array['carry_forward_running_hour','running_hour','total_running_hour','voltage','frequency','current','power','fo_pressure','lo_pressure','lo_temperature','cooling_water_temp_in','cooling_water_temp_out','exhaust_temp']) 
            AS "tagIdentifier"
            FROM vessel_report_generator WHERE form_id IN (select form_id from vessel_report_form where vessel_id=$1 AND is_redundant = ${isRedundant})
            ORDER BY "tagName"  )
            UNION ALL 
            (SELECT distinct zpclutch_identifier||'_'||
            unnest(array['zp_lub_oil_level','zp_lub_oil_pressure','zp_charge_oil_pressure','zp_lub_oil_temp','zp_h_oil_temp_in','zp_h_oil_temp_out','clutch_oil_pressure']) 
            AS "tagName" ,
            'Azimuth thruster' as TAB, 
            unnest(array['zp_lub_oil_level','zp_lub_oil_pressure','zp_charge_oil_pressure','zp_lub_oil_temp','zp_h_oil_temp_in','zp_h_oil_temp_out','clutch_oil_pressure']) 
            AS "tagIdentifier"   
            FROM vessel_report_zpclutch WHERE form_id IN (select form_id from vessel_report_form where vessel_id=$1 AND is_redundant = ${isRedundant})
            ORDER BY "tagName"  ) 
            UNION ALL 
            (SELECT distinct identifier||'_'||
            unnest(array['compressor_current','compressor_suction_pressure','compressor_discharge_pressure','lub_oil_pressure','cooling_water_pressure']) 
            AS "tagName",
                'Air Conditioning' as TAB , 
                unnest(array['compressor_current','compressor_suction_pressure','compressor_discharge_pressure','lub_oil_pressure','cooling_water_pressure']) 
            AS "tagIdentifier"
            FROM vessel_report_air_conditioning  WHERE form_id IN (select form_id from vessel_report_form where vessel_id=$1 AND is_redundant = ${isRedundant})
            ORDER BY "tagName" )
        `,[vesselID])
        if (allTagList instanceof Array && allTagList.length > 0) {
            var rtnObj = {
                Engine : [],
                ROB : [],
                'Tank Soundings' : [],
                'Air Conditioning' : [],
                'Azimuth thruster' : []
            }
           
            allTagList.forEach((record) => {
                if ([
                    "ENGINE"
                ].includes(record.tab)) {
                    rtnObj['Engine'].push({ tag : record.tagName , tagIdentifier : record.tagIdentifier })
                }
                if ([
                    "ROB"
                ].includes(record.tab)) {
                    rtnObj['ROB'].push({ tag : record.tagName, tagIdentifier : record.tagIdentifier  })
                }
                if ([
                    "TANK"
                ].includes(record.tab)) {
                    rtnObj['Tank Soundings'].push({ tag : record.tagName, tagIdentifier : record.tagIdentifier  })
                }
                if ([
                    "Air Conditioning"
                ].includes(record.tab)) {
                    rtnObj['Air Conditioning'].push({ tag : record.tagName, tagIdentifier : record.tagIdentifier })
                }
                if ([
                    "Azimuth thruster"
                ].includes(record.tab)) {
                    rtnObj['Azimuth thruster'].push({ tag : record.tagName, tagIdentifier : record.tagIdentifier  })
                }
                
            })

            //helper.callback(rtnObj, null)
           return rtnObj
        } else {
            return []
        }
    }


   

    async GetDataForTrend(vesselID,startDT, endDT,tagnames,tagIdentifier) {
        let vesselReports = []
        let trendData = []
       
        let trendDataArr = []
       
        let vesselReportForms = await this.GetTrendFormData(vesselID, startDT , endDT)
       
        if (vesselReportForms instanceof Array && vesselReportForms.length > 0) {
            
            for (const vesselFormData of vesselReportForms)
            {
                var elm = {}
                let trendFinalData = {}
                let formatDate = vesselFormData.formDate
                //var formatDate = moment(formDate).format("DD-MMM-YY HH:mm")
               
                let vesselReports_rob  = await this.GetTrendRelatedData(vesselFormData.formId, config.kstConfig.sqlTables.VESSELREPORTROB, ROBMAP, ROBMAP.identifier.col,tagnames,tagIdentifier,formatDate)
                let vesselReports_engine  = await this.GetTrendRelatedData(vesselFormData.formId, config.kstConfig.sqlTables.VESSELREPORTENGINELOG, ELOGMAPPING, ELOGMAPPING.engineIdentifier.col,tagnames,tagIdentifier,formatDate)
                let vesselReports_zpClutch  = await this.GetTrendRelatedData(vesselFormData.formId, config.kstConfig.sqlTables.VESSELREPORTZPCLUTCH, ZPCLUTCH, ZPCLUTCH.identifier.col,tagnames,tagIdentifier,formatDate)
                let vesselReports_tanksoundings  = await this.GetTrendRelatedData(vesselFormData.formId, config.kstConfig.sqlTables.VESSELREPORTTS, TANKSOUNDINGMAP, TANKSOUNDINGMAP.identifier.col,tagnames,tagIdentifier,formatDate)
                let vesselReports_generators  = await this.GetTrendRelatedData(vesselFormData.formId, config.kstConfig.sqlTables.VESSELREPORTGENERATOR, GENERATORMAPPING, GENERATORMAPPING.generatorIdentifier.col,tagnames,tagIdentifier,formatDate)
                let vesselReports_aircons  = await this.GetTrendRelatedData(vesselFormData.formId, config.kstConfig.sqlTables.VESSELREPORTAC, ACMAP, ACMAP.identifier.col,tagnames,tagIdentifier,formatDate)
              
                if(vesselReports_rob instanceof Array && vesselReports_rob.length > 0 && vesselReports_rob[0] !== undefined)
                {

                    Object.assign(trendFinalData,vesselReports_rob[0]);
                }
                if(vesselReports_engine instanceof Array && vesselReports_engine.length > 0 && vesselReports_engine[0] !== undefined)
                {

                    Object.assign(trendFinalData,vesselReports_engine[0]);
                }
                if(vesselReports_zpClutch instanceof Array && vesselReports_zpClutch.length > 0 && vesselReports_zpClutch[0] !== undefined)
                {

                   Object.assign(trendFinalData,vesselReports_zpClutch[0]);
                }
                if(vesselReports_tanksoundings instanceof Array && vesselReports_tanksoundings.length > 0 && vesselReports_tanksoundings[0] !== undefined)
                {

                  Object.assign(trendFinalData,vesselReports_tanksoundings[0]);
                }
                if(vesselReports_generators instanceof Array && vesselReports_generators.length > 0 && vesselReports_generators[0] !== undefined)
                {

                   Object.assign(trendFinalData,vesselReports_generators[0]);
                }
                if(vesselReports_aircons instanceof Array && vesselReports_aircons.length > 0 && vesselReports_aircons[0] !== undefined)
                {

                  Object.assign(trendFinalData,vesselReports_aircons[0]);
                }
                
                elm.timestamp = formatDate;


                if(Object.keys(trendFinalData).length !==0 && typeof trendFinalData !== 'undefined' && trendFinalData)
                {
                    Object.assign(trendFinalData,elm)
                }
              
                vesselReports_rob =[]
                vesselReports_engine =[]
                vesselReports_zpClutch =[]
                vesselReports_tanksoundings =[]
                vesselReports_generators =[]
                vesselReports_aircons =[]
                elm={}

                trendDataArr.push(trendFinalData);
            }
            return trendDataArr
        } else {
            return null
        }
    }

    async GetTrendFormData(reportId, startDT , endDT) {
        const format1 = "DD-MM-YYYY"
        let startDate = moment(startDT).format(format1)
        let endDate = moment(endDT).format(format1)

        let isRedundant = false;
        let vesselReportForms = await this.sqlInterface.PerformQueryPromise(`
        SELECT form_id,report_date,shift
        FROM ${config.kstConfig.sqlTables.VESSELREPORTFORM}
        WHERE vessel_id=$1 AND is_redundant=${isRedundant} AND
        TO_DATE(report_date,'DD-MM-YYYY') >= TO_DATE($2,'DD-MM-YYYY') AND TO_DATE(report_date,'DD-MM-YYYY') <= TO_DATE($3,'DD-MM-YYYY') 
		ORDER BY to_date(report_date,'DD-MM-YYYY') 
        `,[reportId,startDate,endDate])
        return vesselReportForms.map(dbform => {
            let am_pm 
            if(dbform.shift === 1)
            {
                am_pm = 'AM' 
            }
            else
            {
                am_pm = 'PM'
            }
            return {
                formId : dbform.form_id,
                formDate : dbform.report_date.concat(' ',am_pm),
                shift : am_pm,
            
            }
        })
    }

    async GetTrendRelatedData(reportId, tablename, mapping, orderByCol,tagnames,tagIdentifier,formatDate) {
        return await this.GetDataFromTable_Trend( tablename, mapping, { form_id : reportId }, orderByCol,tagnames,tagIdentifier,formatDate)
    }

    async GetDataFromTable_Trend(tablename, mapping, whereconditions, orderByCol,tagnames, tagIdentifier,formatDate) {
            const rows1 = Object.values(mapping).map(col => {
             return `${col.col}`
         })
     
         const tagIdentifierArr = tagIdentifier.split(",")
         let rows = []
         for (var a in tagIdentifierArr)
         {
             if(rows1.includes(tagIdentifierArr[a]))
             {
               rows.push(tagIdentifierArr[a])
               rows.push(orderByCol)
             }
         }
         if(rows[0] === undefined)
         {
            return 
         }
         const tagnamesArray = tagnames.split(",")
         let andConditions =[]
         let addlWhereConditions = ''
         for (var a in tagnamesArray)
         {
            let strIdentifier = tagnamesArray[a].split("_")
            andConditions.push("'"+strIdentifier[0]+"'")
         }
         if(andConditions !== null)
         {
            addlWhereConditions  = ` AND ${orderByCol} in ('${andConditions}')`
         }

         let whereStatement = ''
         let inputs = []
         if (Object.keys(whereconditions).length > 0) {
             whereStatement = 'WHERE '
             Object.keys(whereconditions).forEach((key,i) => {
                 whereStatement += `${key}=$${i+1}`
                 inputs.push(whereconditions[key])
                 if (i < Object.keys(whereconditions).length - 1) {
                     whereStatement += ` AND `
                 }
             })
         }

         if(andConditions !== null)
         {
            addlWhereConditions  = `  AND ${orderByCol} in (${andConditions})`
            whereStatement += "   "+ addlWhereConditions
         }

         let orderByStatement = ''
         if (!helperWithoutApi.IsEmpty(orderByCol)) {
             orderByStatement = `  ORDER BY ${orderByCol}`
         }

         let temp_log = {}
         let logs = await this.sqlInterface.PerformQueryPromise(`
             SELECT ${rows.join(",")}
             FROM ${tablename}
             ${whereStatement}
             ${orderByStatement}
         `,inputs)
         return logs.map(log => {
            
             let recordAvailable = false
             let identifierValue=''

             Object.keys(mapping).forEach(key => {
                if (log[mapping[key].col] !== undefined) {
                    if(mapping[key].col === orderByCol)
                    {
                        identifierValue = log[mapping[key].col]
                    }
                }
                if (mapping[key].type == 'decimal') {
                    if (log[mapping[key].col] !== undefined) {
                        if(identifierValue !== undefined && tagnamesArray.indexOf(identifierValue+'_'+mapping[key].col) > -1)
                        {
                            temp_log[identifierValue+'_'+mapping[key].col] = parseFloat(log[mapping[key].col])
                            recordAvailable = true
                        }
                    }
                }
                else if (mapping[key].type == 'datetime' && log[mapping[key].col] != null) {
                    if (log[mapping[key].col] !== undefined) {
                        if(identifierValue !== undefined && tagnamesArray.indexOf(identifierValue+'_'+mapping[key].col) > -1)
                        {
                            temp_log[identifierValue+'_'+mapping[key].col] = moment(log[mapping[key].col])
                        }
                }
                } else if (mapping[key].type == 'integer') {
                    if (log[mapping[key].col] !== undefined) 
                    {
                        if(identifierValue !== undefined && tagnamesArray.indexOf(identifierValue+'_'+mapping[key].col) > -1)
                        {
                            temp_log[identifierValue+'_'+mapping[key].col] = parseInt(log[mapping[key].col])
                            recordAvailable = true
                        }
                    }
                 } else if (mapping[key].type == 'identity') {
                     if (log[mapping[key].col] !== undefined) {
                        if(identifierValue !== undefined && tagnamesArray.indexOf(identifierValue+'_'+mapping[key].col) > -1)
                        {
                            temp_log[identifierValue+'_'+mapping[key].col] = parseInt(log[mapping[key].col])
                            recordAvailable = true
                        }
                     }
                 } else {
                     if (log[mapping[key].col] !== undefined) {
                        if(identifierValue !== undefined && tagnamesArray.indexOf(identifierValue+'_'+mapping[key].col) > -1)
                        {
                            temp_log[mapping[key].col] = log[mapping[key].col]
                            recordAvailable = true
                        }
                    }
                }
             })
             if(recordAvailable===true)
             {
                return  temp_log
             }
             else
             {
                return null
             }
            
         })
      
     }
    

}
module.exports = {
    service : new AnalyticsService()
};