const moment = require('moment');
const config = require('../config/config');
const {interfaceObj} = require("./interfaces/PostGreSQLInterface")
const ELOGMAPPING = {
    engineIdentifier : { col : "engine_identifier", type: "string" },
    // carryForwardRunningHour: {col: "carry_forward_running_hour", type: 'decimal'},
    // runningHour : {col: "running_hour", type: 'decimal'},
    // LNGcarryForwardRunningHour: {col: "lng_carry_forward_running_hour", type: 'decimal'},
    // LNGrunningHour : {col: "lng_running_hour", type: 'decimal'},
    // totalRunningHour:  {col: "total_running_hour", type: 'decimal'},
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
    noOfTugs : { col : "no_of_tugs", type: "decimal" }
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

const DeckLogTitles = {
    startLocation : 'Location From',
    endLocation : 'Location To',
    starttime : 'Start Time',
    endtime : 'End Time',
    status : 'Status',
    otherStatus : 'Status Remarks (If Operation)',
    typeOfJob : 'Type of Job',
    tugPosition : 'Tug Position',
    noOfTugs : 'No. of Tugs',
}

const EngineTitles = {
    carryForwardRunningHour : 'Main Engine Running Hour Carry Forward',
    runningHour : 'Main Engine Running Hour Daily Hour',
    LNGcarryForwardRunningHour : 'Main Engine LNG Running Hour Carry Forward',
    LNGrunningHour : 'Main Engine LNG Running Hour Daily Hour',
    totalRunningHour : 'Main Engine Running Hour Total',
    totalLNGRunningHour : 'Main Engine LNG Running Hour Total',
    chargeAirPressure : 'Main Engine Charge Air Press',
    chargeAirTemp : 'Main Engine Charge Air Temp',
    turboChargerRpm : 'Main Engine Turbocharger RPM',
    turboChargerExhaustTempIn : 'Main Engine Turbocharger Exhaust Temp (In)',
    turboChargerExhaustTempOut : 'Main Engine Turbocharger Exhaust Temp (Out)',
    turboChargerLubOilPressure : 'Main Engine Turbocharger Lub. Oil Press',
    remarks : 'Main Engine Remarks (Optional)',
    rpm : 'Main Engine RPM',
    propellerRpm : 'Main Engine Propeller RPM',
    cppPitch : 'Main Engine CPP Pitch, if applicable',
    fuelrack : 'Main Engine Fuel Rack / Level',
    lubOilPressure : 'Main Engine Lub. Oil Press',
    fuelOilPressure : 'Main Engine Fuel Oil Press',
    lubOilTempBfCooler : 'Main Engine LO Temp Before Cooler',
    lubOilTempAfCooler : 'Main Engine LO Temp After Cooler',
    cylinder1PeakPressure : 'Main Engine Combustion Peak Pressure (Cylinder #1)',
    cylinder2PeakPressure : 'Main Engine Combustion Peak Pressure (Cylinder #2)',
    cylinder3PeakPressure : 'Main Engine Combustion Peak Pressure (Cylinder #3)',
    cylinder4PeakPressure : 'Main Engine Combustion Peak Pressure (Cylinder #4)',
    cylinder5PeakPressure : 'Main Engine Combustion Peak Pressure (Cylinder #5)',
    cylinder6PeakPressure : 'Main Engine Combustion Peak Pressure (Cylinder #6)',
    cylinder7PeakPressure : 'Main Engine Combustion Peak Pressure (Cylinder #7)',
    cylinder8PeakPressure : 'Main Engine Combustion Peak Pressure (Cylinder #8)',
    freshwaterPressure : 'Main Engine F.W. Cooling Press',
    freshwaterTempIn : 'Main Engine Cooling Fresh Water Temp In',
    freshwaterTempOut : 'Main Engine Cooling Fresh Water Temp Out',
    cylinder1ExhaustTemp : 'Main Engine Exhaust Temp (Cylinder 1)',
    cylinder2ExhaustTemp : 'Main Engine Exhaust Temp (Cylinder 2)',
    cylinder3ExhaustTemp : 'Main Engine Exhaust Temp (Cylinder 3)',
    cylinder4ExhaustTemp : 'Main Engine Exhaust Temp (Cylinder 4)',
    cylinder5ExhaustTemp : 'Main Engine Exhaust Temp (Cylinder 5)',
    cylinder6ExhaustTemp : 'Main Engine Exhaust Temp (Cylinder 6)',
    cylinder7ExhaustTemp : 'Main Engine Exhaust Temp (Cylinder 7)',
    cylinder8ExhaustTemp : 'Main Engine Exhaust Temp (Cylinder 8)',
    seawaterPressure : 'Main Engine S.W. Cooling Press',
    seawaterTempIn : 'Main Engine Cooling Sea Water Temp In',
    seawaterTempOut : 'Main Engine Cooling Sea Water Temp Out'
}

const GeneratorTitles = {
    carryForwardRunningHour : 'Running Hour Carry Forward',
    runningHour : 'Running Hour Daily Hour',
    totalRunningHour : 'Running Hour Total',
    voltage : 'Voltage',
    frequency : 'Frequency',
    current : 'Current',
    power : 'Power',
    remarks : 'Remarks (Optional)',
    foPressue : 'FO Press',
    loPressure : 'LO Press',
    loTemp : 'LO Temp',
    loLevel : 'LO Level',
    coolingWaterTempIn : 'Cooling Water Temp In',
    coolingWaterTempOut : 'Cooling Water Temp Out',
    exhaustTemp : 'Exhaust Temp (Before Turbocharger)',
}

const AzimuthThrusterTitles = {
    zpLoLevel : 'ZP LO Level (ISO VG100)',
    zpLoPressure : 'ZP LO Press',
    zpChargeOilPressure : 'ZP Charge Oil Press',
    zpLoTemp : 'ZP LO Temp',
    zpHoLevel : 'ZP Hydraulic Oil Level (ISO VG46 or 68)',
    zpHoTempIn : 'ZP Hydraulic Oil at Cooler (In)',
    zpHoTempOut : 'ZP Hydraulic Oil at Cooler (Out)',
    clutchOilPressure : 'Clutch Oil Press',
    zpRemarks : 'ZP Remarks (Optional)',
}

const AirConditioningTitle = {
    compressorCurrent : 'Compressor Amp',
    compressorSuctionPressure : 'Compressor Suction Press',
    compressorDischargePressure : 'Compressor Discharge Press',
    loPressure : 'LO Press',
    coolingWaterPressure : 'Cooling Water Press',
    remarks : 'Remarks (Optional)',
}

const DAILYLOGMAP = {
    formId : { col : "form_id", type: "identity" },
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
const ENGINEIDENTIFIERS = {
    SMainEngine : "S",
    PMainEngine : "P",
}
const DAILYLOGENGINEMAPPING = {
    engineIdentifier : { col : "engine_identifier", type: "string" },
    carryForwardRunningHour: {col: "carry_forward_running_hour", type: 'decimal'},
    runningHour : {col: "running_hour", type: 'decimal'},
    LNGcarryForwardRunningHour: {col: "lng_carry_forward_running_hour", type: 'decimal'},
    LNGrunningHour : {col: "lng_running_hour", type: 'decimal'},
    totalRunningHour:  {col: "total_running_hour", type: 'decimal'},
    totalLNGRunningHour:  {col: "total_lng_running_hour", type: 'decimal'},
}

const GENERATORIDENTIFIERS = {
    AE1 : "AE1",
    AE2 : "AE2",
    AE3 : "AE3",
}
const DAILYLOGGENERATORMAPPING = {
    carryForwardRunningHour: {col: "carry_forward_running_hour", type: 'decimal'},
    runningHour : {col: "running_hour", type: 'decimal'},
    totalRunningHour:  {col: "total_running_hour", type: 'decimal'},
    generatorIdentifier : { col : "generator_identifier", type: "string" },
}

const isEmpty = element => {
    if(element===undefined || element===null || element==='')
        return true;
    else
        return false;
}

const getDifferenceDays = (start, end) => {
    let days = moment(end).diff(moment(start), 'days');
    let daysInSeconds = days*24*60*60;
    let secondsLeft = moment(end).diff(moment(start), 'seconds');
    days = (days + (secondsLeft-daysInSeconds)/(24*60*60)).toFixed(2);
    return days;
}
class ExportCSVService {
    constructor () {
        this.sqlInterface = interfaceObj
    }
    async GetVesselReportPageRelatedData(reportId, tablename, mapping, orderByCol) {
        return await this.sqlInterface.GetDataFromTable( tablename, mapping, { form_id : reportId }, orderByCol)
    }
    async GetDailyLogPageRelatedData(reportId, tablename, mapping, orderByCol) {
        return await this.sqlInterface.GetDataFromTable( tablename, mapping, { daily_log_form_id : reportId }, orderByCol)
    }
    async GetGeneratorStructure(vesselId) {
        var generators = await this.sqlInterface.PerformQueryPromise(`
            SELECT generator_identifier
            FROM ${config.kstConfig.sqlTables.GENERATOR}
            WHERE vessel_id=$1 ORDER BY order_id
        `,[vesselId])
        return generators;
    }
    async GetLastDayVesselData(vesselId, today){
        var forms = await this.sqlInterface.PerformQueryPromise(`
            SELECT form_id, form_date, report_date FROM ${config.kstConfig.sqlTables.DAILYLOGFORM} WHERE 
            TO_DATE(report_date, 'DD-MM-YYYY') IN (SELECT MAX(TO_DATE(report_date, 'DD-MM-YYYY')) FROM ${config.kstConfig.sqlTables.DAILYLOGFORM} WHERE report_date <> $2 AND vessel_id = $1 AND is_redundant=$3)
            AND vessel_id = $1 AND is_redundant=$3
            ORDER BY form_id DESC
        `,[vesselId, today, false]);
        let formData = [];
        if(forms instanceof Array && forms.length>0){
            for(let i=0; i<forms.length;i++){
                let reportId = parseInt(forms[i].form_id);
                let temp = {formDate: forms[i].report_date, formId: reportId}
                temp.engines = await this.GetDailyLogPageRelatedData(reportId, config.kstConfig.sqlTables.DAILYLOGENGINELOG, DAILYLOGENGINEMAPPING, DAILYLOGENGINEMAPPING.engineIdentifier.col)
                temp.generators = await this.GetDailyLogPageRelatedData(reportId, config.kstConfig.sqlTables.DAILYLOGGENERATOR, DAILYLOGGENERATORMAPPING, DAILYLOGGENERATORMAPPING.generatorIdentifier.col)
                temp.rob = await this.GetDailyLogPageRelatedData(reportId, config.kstConfig.sqlTables.VESSELREPORTROB, ROBMAP, ROBMAP.identifier.col)
                formData.push(temp);
            }
        }
        return formData;
    }
    async GetData(today) {
        let returnData = {breakdownData: [], vesselData: [], vessels: []};

        let vessels = await this.sqlInterface.PerformQueryPromise(`
            SELECT vessel_id, name
            FROM ${config.kstConfig.sqlTables.VESSEL} ORDER BY vessel_id
        `,[]);
        returnData.vessels = vessels;
        if(vessels instanceof Array && vessels.length>0){
            let count = 1;
            for(let i=0; i<vessels.length; i++){
                let temp = {
                    engines: [
                        {
                            name: 'S',
                            daily: 0
                        },
                        {
                            name: 'P',
                            daily: 0
                        }
                    ],
                    generators: [],
                    fuelOilROB: 0,
                    fuelOilConsumed: 0
                }

                let generatorStructure = await this.GetGeneratorStructure(vessels[i].vessel_id);
                generatorStructure.forEach(element=>{
                    temp.generators.push({
                        name: element.generator_identifier,
                        daily: 0
                    })
                })
                let lastDayVesselData = await this.GetLastDayVesselData(vessels[i].vessel_id, today);
                let formDate = '';
                if(lastDayVesselData instanceof Array && lastDayVesselData.length>0){
                    for(let j=0; j<lastDayVesselData.length; j++){
                        lastDayVesselData[j].engines.forEach(element=>{
                            temp.engines.forEach(engElement=>{
                                if(engElement.name===element.engineIdentifier){
                                    engElement.daily += element.runningHour;
                                }
                            })
                        })
            
                        lastDayVesselData[j].generators.forEach(element=>{
                            temp.generators.forEach(genElement=>{
                                if(genElement.name===element.generatorIdentifier){
                                    genElement.daily += element.runningHour
                                }
                            })
                        });
                        formDate = lastDayVesselData[0].formDate;
                        let fuelOilROB = lastDayVesselData[0].rob.filter(element=>element.identifier==="Fuel Oil");
                        if(fuelOilROB instanceof Array && fuelOilROB.length>0){
                            temp['fuelOilROB'] = fuelOilROB[0].rob;
                        }
                        let fuelOilConsumed = lastDayVesselData[j].rob.filter(element=>element.identifier==="Fuel Oil");
                        if(fuelOilConsumed instanceof Array && fuelOilConsumed.length>0){
                            temp['fuelOilConsumed'] += fuelOilConsumed[0].consumed;
                        }
                    }
                }
                let temp2 = { 'S No.': count++, 'Date': formDate, 'Vessel Name': vessels[i].name, 'Fuel Oil ROB (Litres)': temp['fuelOilROB'], 'Fuel Oil Consumed (Litres)': temp['fuelOilConsumed']  };
                let mainEngineRunningHourTotal = 0
                temp.engines.forEach(element=>{
                    temp2[`${element.name} Main Engine Running Hours`] = element.daily;
                    mainEngineRunningHourTotal += element.daily;
                })
                temp2['Hourly Rate'] = mainEngineRunningHourTotal===0?'':temp['fuelOilConsumed']/mainEngineRunningHourTotal;
                temp.generators.forEach(element=>{
                    temp2[`${element.name} Running Hours`] = element.daily;
                })
                returnData.vesselData.push(temp2);
            }
        }

        let breakdownData = await this.sqlInterface.PerformQueryPromise(`
            SELECT e.vessel_id, e.vessel_name, e.breakdown_datetime, e.back_to_operation_datetime, e.reason, e.status, s.superintendent, s.category, s.remarks, s.vessel_replacement, s.vessel_condition, s.record_id
            FROM ${config.kstConfig.sqlTables.VESSELBREAKDOWNEVENT} e LEFT JOIN ${config.kstConfig.sqlTables.VESSELBREAKDOWNSUPT} s ON e.event_id=s.event_id WHERE e.is_redundant=false ORDER BY e.event_id DESC
        `, []);
        if(breakdownData instanceof Array && breakdownData.length>0){
            let count = 1;
            breakdownData.forEach(element => returnData.breakdownData.push({
                    'S No.': count++,
                    'Vessel Name': element.vessel_name,
                    'Breakdown Datetime': isEmpty(element.breakdown_datetime)===true?'':moment(element.breakdown_datetime).format('DD-MM-YYYY HH:mm'),
                    'Back To Operation Datetime': isEmpty(element.back_to_operation_datetime)===true?'':moment(element.back_to_operation_datetime).format('DD-MM-YYYY HH:mm'),
                    'Downtime Duration (No. of Days)': (isEmpty(element.back_to_operation_datetime)===false&&isEmpty(element.breakdown_datetime)===false)?getDifferenceDays(element.breakdown_datetime, element.back_to_operation_datetime):'',
                    'Reason': element.reason,
                    'Status': element.status,
                    'Superintendent': element.superintendent,
                    'Category': element.category,
                    'Remarks': element.remarks,
                    'Vessel Replacement': element.vessel_replacement,
                    'Vessel Condition': element.vessel_condition,
                })
            )
        }


        return returnData;
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
    async GetVesselReportDataForDatePeriod(startDate, endDate, vesselId){
        var forms = await this.sqlInterface.PerformQueryPromise(`
            SELECT form_id, form_date, report_date, shift, is_backdated as backdated FROM ${config.kstConfig.sqlTables.VESSELREPORTFORM} WHERE 
            TO_DATE(report_date, 'DD-MM-YYYY') >= TO_DATE($1, 'DD-MM-YYYY') AND 
			TO_DATE(report_date, 'DD-MM-YYYY') <= TO_DATE($2, 'DD-MM-YYYY') AND 
			vessel_id = $3 AND is_redundant = $4
            ORDER BY form_id DESC
        `,[startDate, endDate, vesselId, false]);
        let formData = [];
        let headers = [{label: 'Form Date', key: 'formDate'}, {label: 'Shift', key: 'shift'}, {label: 'backdated',key: 'backdated'}];
        if(forms instanceof Array && forms.length>0){
            for(let i=0; i<forms.length;i++){
                let reportId = parseInt(forms[i].form_id);
                let temp = {formDate: forms[i].report_date, shift: forms[i].shift===1?'Morning Shift':forms[i].shift===2?'Evening Shift':'', formId: reportId, backdated: forms[i].backdated === true ? moment(forms[i].form_date).format('DD-MM-YYYY HH:mm') : ""}
                let tempResult = {};
                temp.crew = await this.GetVesselReportPageRelatedCrew(reportId)
                let temp2 = await this.GetVesselReportPageRelatedData(reportId, config.kstConfig.sqlTables.DECKLOG, DECKLOGMAP, "order_priority")
                temp2.forEach((element, idx)=>{
                    for(const [key, value] of Object.entries(element)){
                        if(key==='starttime'||key==='endtime'){
                            tempResult[`Decklog-${idx}-${key}`] = isEmpty(value)===true?'':moment(value).format('hh:mm a');
                        }
                        else
                            tempResult[`Decklog-${idx}-${key}`] = value;
                        if(i===0)
                            headers.push({ label: `Decklog-${DeckLogTitles[key]}`, key: `decklogs.Decklog-${idx}-${key}` })
                    }
                })
                temp.decklogs = tempResult;
                temp2 = await this.GetVesselReportPageRelatedData(reportId, config.kstConfig.sqlTables.VESSELREPORTENGINELOG, ELOGMAPPING, ELOGMAPPING.engineIdentifier.col)
                tempResult = {};
                temp2.forEach((element, idx)=>{
                    for(const [key, value] of Object.entries(element)){
                        tempResult[`Engine-${element.engineIdentifier}-${key}`] = value;
                        if(i===0 && key!=='engineIdentifier')
                            headers.push({ label: `Engine-${element.engineIdentifier}-${EngineTitles[key]}`, key: `engines.Engine-${element.engineIdentifier}-${key}` })
                    }
                })
                temp.engines = tempResult;
                temp2 = await this.GetVesselReportPageRelatedData(reportId, config.kstConfig.sqlTables.VESSELREPORTGENERATOR, GENERATORMAPPING, GENERATORMAPPING.generatorIdentifier.col)
                tempResult = {};
                temp2.forEach((element, idx)=>{
                    for(const [key, value] of Object.entries(element)){
                        tempResult[`Generator-${element.generatorIdentifier}-${key}`] = value;
                        if(i===0 && key!=='generatorIdentifier')
                            headers.push({ label: `Generator-${element.generatorIdentifier}-${GeneratorTitles[key]}`, key: `generators.Generator-${element.generatorIdentifier}-${key}` })
                    }
                })
                temp.generators = tempResult;
                temp2 = await this.GetVesselReportPageRelatedData(reportId, config.kstConfig.sqlTables.VESSELREPORTZPCLUTCH, ZPCLUTCH, ZPCLUTCH.identifier.col)
                tempResult = {};
                temp2.forEach((element, idx)=>{
                    for(const [key, value] of Object.entries(element)){
                        tempResult[`Azimuth Thrusters-${element.identifier}-${key}`] = value;
                        if(i===0 && key!=='identifier')
                            headers.push({ label: `Azimuth Thrusters-${element.identifier}-${AzimuthThrusterTitles[key]}`, key: `zpClutch.Azimuth Thrusters-${element.identifier}-${key}` })
                    }
                })
                temp.zpClutch = tempResult;
                temp2 = await this.GetVesselReportPageRelatedData(reportId, config.kstConfig.sqlTables.VESSELREPORTAC, ACMAP, ACMAP.identifier.col)
                tempResult = {};
                temp2.forEach((element, idx)=>{
                    for(const [key, value] of Object.entries(element)){
                        tempResult[`Aircons-${element.identifier}-${key}`] = value;
                        if(i===0 && key!=='identifier')
                            headers.push({ label: `Aircons-${element.identifier}-${AirConditioningTitle[key]}`, key: `aircons.Aircons-${element.identifier}-${key}` })
                    }
                })
                temp.aircons = tempResult;
                temp2 = await this.GetVesselReportPageRelatedData(reportId, config.kstConfig.sqlTables.VESSELREPORTROB, ROBMAP, ROBMAP.identifier.col)
                tempResult = {};
                temp2.forEach((element, idx)=>{
                    for(const [key, value] of Object.entries(element)){
                        tempResult[`ROB-${element.identifier}-${key}`] = value;
                        if(i===0 && key!=='identifier')
                            headers.push({ label: `ROB-${element.identifier}-${key}`, key: `rob.ROB-${element.identifier}-${key}` })
                    }
                })
                temp.rob = tempResult;
                temp2 = await this.GetVesselReportPageRelatedData(reportId, config.kstConfig.sqlTables.VESSELREPORTTS, TANKSOUNDINGMAP, TANKSOUNDINGMAP.identifier.col)
                tempResult = {};
                temp2.forEach((element, idx)=>{
                    for(const [key, value] of Object.entries(element)){
                        tempResult[`Tank Soundings-${element.identifier}-${key}`] = value;
                        if(i===0 && key!=='identifier')
                            headers.push({ label: `Tank Soundings-${element.identifier}-${key}`, key: `tanksoundings.Tank Soundings-${element.identifier}-${key}` })
                    }
                })
                temp.tanksoundings = tempResult; 
                formData.push(temp);
            }
        }
        return {headers: headers, data: formData};
    }

    async GetDailyLogDataForDatePeriod(startDate, endDate, vesselId){
        var forms = await this.sqlInterface.PerformQueryPromise(`
            SELECT form_id, form_date, report_date, is_backdated as backdated FROM ${config.kstConfig.sqlTables.DAILYLOGFORM} WHERE 
            TO_DATE(report_date, 'DD-MM-YYYY') >= TO_DATE($1, 'DD-MM-YYYY') AND 
			TO_DATE(report_date, 'DD-MM-YYYY') <= TO_DATE($2, 'DD-MM-YYYY') AND 
			vessel_id = $3 AND is_redundant = $4
            ORDER BY form_id DESC
        `,[startDate, endDate, vesselId, false]);
        let formData = [];
        let headers = [{label: 'Form Date', key: 'formDate'}, {label: 'backdated',key: 'backdated'}];
        if(forms instanceof Array && forms.length>0){
            for(let i=0; i<forms.length;i++){
                let reportId = parseInt(forms[i].form_id);
                let temp = {formDate: forms[i].report_date, formId: reportId, backdated: forms[i].backdated === true ? moment(forms[i].form_date).format('DD-MM-YYYY HH:mm') : ""}
                let tempResult = {};
                let temp2 = await this.GetDailyLogPageRelatedData(reportId, config.kstConfig.sqlTables.DAILYLOGENGINELOG, DAILYLOGENGINEMAPPING, DAILYLOGENGINEMAPPING.engineIdentifier.col)
                tempResult = {};
                temp2.forEach((element, idx)=>{
                    for(const [key, value] of Object.entries(element)){
                        tempResult[`Engine-${element.engineIdentifier}-${key}`] = value;
                        if(i===0 && key!=='engineIdentifier')
                            headers.push({ label: `Engine-${element.engineIdentifier}-${EngineTitles[key]}`, key: `engines.Engine-${element.engineIdentifier}-${key}` })
                    }
                })
                temp.engines = tempResult;
                temp2 = await this.GetDailyLogPageRelatedData(reportId, config.kstConfig.sqlTables.DAILYLOGGENERATOR, DAILYLOGGENERATORMAPPING, GENERATORMAPPING.generatorIdentifier.col)
                tempResult = {};
                temp2.forEach((element, idx)=>{
                    for(const [key, value] of Object.entries(element)){
                        tempResult[`Generator-${element.generatorIdentifier}-${key}`] = value;
                        if(i===0 && key!=='generatorIdentifier')
                            headers.push({ label: `Generator-${element.generatorIdentifier}-${GeneratorTitles[key]}`, key: `generators.Generator-${element.generatorIdentifier}-${key}` })
                    }
                })
                temp.generators = tempResult;
                temp2 = await this.GetDailyLogPageRelatedData(reportId, config.kstConfig.sqlTables.VESSELREPORTROB, ROBMAP, ROBMAP.identifier.col)
                tempResult = {};
                temp2.forEach((element, idx)=>{
                    for(const [key, value] of Object.entries(element)){
                        tempResult[`ROB-${element.identifier}-${key}`] = value;
                        if(i===0 && key!=='identifier')
                            headers.push({ label: `ROB-${element.identifier}-${key}`, key: `rob.ROB-${element.identifier}-${key}` })
                    }
                })
                temp.rob = tempResult;
                temp2 = await this.GetDailyLogPageRelatedData(reportId, config.kstConfig.sqlTables.VESSELREPORTTS, TANKSOUNDINGMAP, TANKSOUNDINGMAP.identifier.col)
                tempResult = {};
                temp2.forEach((element, idx)=>{
                    for(const [key, value] of Object.entries(element)){
                        tempResult[`Tank Soundings-${element.identifier}-${key}`] = value;
                        if(i===0 && key!=='identifier')
                            headers.push({ label: `Tank Soundings-${element.identifier}-${key}`, key: `tanksoundings.Tank Soundings-${element.identifier}-${key}` })
                    }
                })
                temp.tanksoundings = tempResult; 
                formData.push(temp);
            }
        }
        return {headers: headers, data: formData};
    }

    async GetFORHDataForDatePeriod(startDate, endDate, vessel_id){
        let formData = [];
        let headers = [
            {label: 'Form Date', key: 'formDate'}, 
            { label: 'Backdated', key: 'backdated'},
            {label: 'Vessel Name', key: 'vesselName'},
            { label: `Fuel Oil Received (Litres)`, key: `fuelOilReceived` },
            { label: `Fuel Oil ROB (Litres)`, key: `fuelOilROB` },
            { label: `Fuel Oil Consumed (Litres)`, key: `fuelOilConsumed` },
            { label: `Total running hours (S/P)`, key: `totalRunningHour` },
            { label: `Hourly Rate (L/hr)`, key: `hourlyRate` },
            { label: `S Main Engine FO Running Hours`, key: `SRunningHour` },
            { label: `P Main Engine FO Running Hours`, key: `PRunningHour` },
            { label: `Error`, key: `error` },
            { label: `S Main Engine LNG Running Hours`, key: `SLNGRunningHour` },
            { label: `P Main Engine LNG Running Hours`, key: `PLNGRunningHour` },
            { label: `LNG Error`, key: `LNGerror` },
            { label: `LNG Received (kg)`, key: `LNGReceived` },
            { label: `LNG ROB (kg)`, key: `LNGROB` },
            { label: `LNG Consumed(kg)`, key: `LNGConsumed` },
            { label: `Total Running Hours LNG (S/P)`, key: `totalLNGRunningHour` },
            { label: `LNG Consumption Rate (kg/hr) -  P&S`, key: `hourlyLNGRate` },
            { label: `AE 1 Running Hours`, key: `AE 1RunningHour` },
            { label: `AE 2 Running Hours`, key: `AE 2RunningHour` },
            { label: `AE 3 Running Hours`, key: `AE 3RunningHour` }
        ];

        let vessels = await this.sqlInterface.PerformQueryPromise(`
        SELECT vessel_id, name
        FROM ${config.kstConfig.sqlTables.VESSEL} ORDER BY vessel_id
        `,[]);
        for(let v=0; v<vessels.length; v++){
            if(vessel_id.toString()==='0'||vessels[v]['vessel_id']===vessel_id){

                var forms = await this.sqlInterface.PerformQueryPromise(`
                    SELECT form_id, form_date, report_date, is_backdated as backdated FROM ${config.kstConfig.sqlTables.DAILYLOGFORM} WHERE 
                    TO_DATE(report_date, 'DD-MM-YYYY') >= TO_DATE($1, 'DD-MM-YYYY') AND 
                    TO_DATE(report_date, 'DD-MM-YYYY') <= TO_DATE($2, 'DD-MM-YYYY') AND 
                    vessel_id = $3 AND is_redundant= $4
                    ORDER BY form_id DESC
                `,[startDate, endDate, vessels[v]['vessel_id'], false]);
                if(forms instanceof Array && forms.length>0){
                    for(let i=0; i<forms.length;i++){
                        let reportId = parseInt(forms[i].form_id);
                        let result = {formDate: forms[i].report_date, formId: reportId, vesselName: vessels[v]['name'], backdated : forms[i].backdated === true ? moment(forms[i].form_date).format('DD-MM-YYYY HH:mm') : ""};

                        // New dev by hari - starts

                        var temp = {
                            generators : []
                        }
                        let generatorStructure = await this.GetGeneratorStructure(vessels[v].vessel_id);
                        generatorStructure.forEach(element=>{
                            temp.generators.push({
                                name: element.generator_identifier,
                                daily: 0
                            })
                        });               

                        var dailyLogGenerator = await this.GetDailyLogPageRelatedData(reportId, config.kstConfig.sqlTables.DAILYLOGGENERATOR, DAILYLOGGENERATORMAPPING, DAILYLOGGENERATORMAPPING.generatorIdentifier.col);
                        dailyLogGenerator.forEach(element=>{
                            temp.generators.forEach(genElement=>{
                                if(genElement.name===element.generatorIdentifier){
                                    genElement.daily += element.runningHour
                                }
                            })
                        });

                        temp.generators.forEach(element=>{
                            result[`${element.name}RunningHour`] = element.daily;
                        });
                        
                        if(isEmpty(result['AE 1RunningHour']) || isNaN(result['AE 1RunningHour'])) {
                            result[`AE 1RunningHour`] = '-';
                        } 
                        if(isEmpty(result['AE 2RunningHour']) || isNaN(result['AE 2RunningHour'])) {
                            result[`AE 2RunningHour`] = '-';
                        } 
                        if(isEmpty(result['AE 3RunningHour']) || isNaN(result['AE 3RunningHour'])) {
                            result[`AE 3RunningHour`] = '-';
                        }

                        // New dev by hari - ends

                        let tempROB = await this.sqlInterface.PerformQueryPromise(`
                            SELECT received, rob, consumed FROM ${config.kstConfig.sqlTables.VESSELREPORTROB} WHERE 
                            daily_log_form_id = ${reportId} AND identifier = 'Fuel Oil'
                            ORDER BY daily_log_form_id DESC
                        `,[]);
                        if(tempROB instanceof Array && tempROB.length>0){
                            result.fuelOilReceived = tempROB[0].received;
                            result.fuelOilROB = tempROB[0].rob;
                            result.fuelOilConsumed = tempROB[0].consumed;
                        }
                        else{
                            result.fuelOilReceived = '-';
                            result.fuelOilROB = '-';
                            result.fuelOilConsumed = '-';
                        }
    
                        let tempLNG = await this.sqlInterface.PerformQueryPromise(`
                            SELECT received, rob, consumed FROM ${config.kstConfig.sqlTables.VESSELREPORTROB} WHERE 
                            daily_log_form_id = ${reportId} AND identifier = 'LNG'
                            ORDER BY daily_log_form_id DESC
                        `,[]);
                        if(tempLNG instanceof Array && tempLNG.length>0){
                            result.LNGReceived = tempLNG[0].received;
                            result.LNGROB = tempLNG[0].rob;
                            result.LNGConsumed = tempLNG[0].consumed;
                        }
                        else{
                            result.LNGReceived = '-';
                            result.LNGROB = '-';
                            result.LNGConsumed = '-';
                        }
    
                        let tempSRunningHour = await this.sqlInterface.PerformQueryPromise(`
                            SELECT running_hour, lng_running_hour FROM ${config.kstConfig.sqlTables.DAILYLOGENGINELOG} WHERE 
                            daily_log_form_id = ${reportId} AND engine_identifier = 'S'
                            ORDER BY daily_log_form_id DESC
                        `,[]);
                        if(tempSRunningHour instanceof Array && tempSRunningHour.length>0){
                            result.SRunningHour = tempSRunningHour[0].running_hour;
                            result.SLNGRunningHour = tempSRunningHour[0].lng_running_hour;
                        }
                        else{
                            result.SRunningHour = '-';
                            result.SLNGRunningHour = '-';
                        }
    
                        let tempPRunningHour = await this.sqlInterface.PerformQueryPromise(`
                            SELECT running_hour, lng_running_hour FROM ${config.kstConfig.sqlTables.DAILYLOGENGINELOG} WHERE 
                            daily_log_form_id = ${reportId} AND engine_identifier = 'P'
                            ORDER BY daily_log_form_id DESC
                        `,[]);
                        if(tempPRunningHour instanceof Array && tempPRunningHour.length>0){
                            result.PRunningHour = tempPRunningHour[0].running_hour;
                            result.PLNGRunningHour = tempPRunningHour[0].lng_running_hour;
                        }
                        else{
                            result.PRunningHour = '-';
                            result.PLNGRunningHour = '-';
                        }
    
                        if(result.SRunningHour===result.PRunningHour || result.SRunningHour===0 || result.PRunningHour===0){
                            result.error = 0;
                        }
                        else{
                            result.error = 1;
                        }
                        if(result.SLNGRunningHour===result.PLNGRunningHour || result.SLNGRunningHour===0 || result.PLNGRunningHour===0){
                            result.LNGerror = 0;
                        }
                        else{
                            result.LNGerror = 1;
                        }
    
                        if(result.SRunningHour==='-'){
                            if(result.PRunningHour==='-'){
                                result.totalRunningHour = '-'
                            }
                            else{
                                result.totalRunningHour = result.PRunningHour
                            }
                        }
                        else if(result.PRunningHour==='-'){
                            if(result.SRunningHour==='-'){
                                result.totalRunningHour = '-'
                            }
                            else{
                                result.totalRunningHour = result.SRunningHour
                            }
                        }
                        else{
                            result.totalRunningHour = result.SRunningHour>result.PRunningHour?result.SRunningHour:result.PRunningHour;
                        }
    
                        if(result.totalRunningHour==='-'||result.totalRunningHour===0){
                            result.hourlyRate='-';
                        }
                        else{
                            result.hourlyRate=result.fuelOilConsumed/result.totalRunningHour;
                        }
    
                        if(result.SLNGRunningHour==='-'){
                            if(result.PLNGRunningHour==='-'){
                                result.totalLNGRunningHour = '-'
                            }
                            else{
                                result.totalLNGRunningHour = result.PLNGRunningHour
                            }
                        }
                        else if(result.PLNGRunningHour==='-'){
                            if(result.SLNGRunningHour==='-'){
                                result.totalLNGRunningHour = '-'
                            }
                            else{
                                result.totalLNGRunningHour = result.SLNGRunningHour
                            }
                        }
                        else{
                            result.totalLNGRunningHour = result.SLNGRunningHour>result.PLNGRunningHour?result.SLNGRunningHour:result.PLNGRunningHour;
                        }
    
                        if(result.totalLNGRunningHour==='-'||result.totalLNGRunningHour===0){
                            result.hourlyLNGRate='-';
                        }
                        else{
                            result.hourlyLNGRate=result.LNGConsumed/result.totalLNGRunningHour;
                        }
                        formData.push(result);
                    }
                }
            }
        }
        return {headers: headers, data: formData};
    }
    async GetMissingLogs(startDate, endDate){
        let headers = [
            { label: `Date`, key: `reportDate` },
            { label: `Vessel Name`, key: `vesselName` },
            { label: `Morning Shift`, key: `morningShift` },
            { label: `Evening Shift`, key: `eveningShift` },
            { label: `Daily Log`, key: `dailyLog` },
        ]
        let vessels = await this.sqlInterface.PerformQueryPromise(`
        SELECT vessel_id, name
        FROM ${config.kstConfig.sqlTables.VESSEL} ORDER BY vessel_id
        `,[]);
        let vrfsubmissions = await this.sqlInterface.PerformQueryPromise(`
        SELECT report_date, vessel_id, shift FROM ${config.kstConfig.sqlTables.VESSELREPORTFORM} 
        WHERE TO_DATE(report_date, 'DD-MM-YYYY') >= TO_DATE($1, 'DD-MM-YYYY') AND 
        TO_DATE(report_date, 'DD-MM-YYYY') <= TO_DATE($2, 'DD-MM-YYYY') AND is_redundant = $3
        `, [startDate, endDate,false]);
        let dlsubmissions = await this.sqlInterface.PerformQueryPromise(`
        SELECT report_date, vessel_id FROM ${config.kstConfig.sqlTables.DAILYLOGFORM} 
        WHERE TO_DATE(report_date, 'DD-MM-YYYY') >= TO_DATE($1, 'DD-MM-YYYY') AND 
        TO_DATE(report_date, 'DD-MM-YYYY') <= TO_DATE($2, 'DD-MM-YYYY') AND is_redundant = $3
        `, [startDate, endDate,false]);
        let result={};
        for(let i=moment(startDate, 'DD-MM-YYYY'); i.isSameOrBefore(moment(endDate, 'DD-MM-YYYY')); i.add(1, 'days')){
            for(let j=0; j<vessels.length; j++){
                result[`${i.format('DD-MM-YYYY')}-${vessels[j].vessel_id}`] = {reportDate: i.format('DD-MM-YYYY'), vesselName: vessels[j].name, morningShift: 'Not Submitted', eveningShift: 'Not Submitted', dailyLog: 'Not Submitted'}
            }
        }
        console.log(result)
        vrfsubmissions.forEach(e=>{
            console.log(`${e.report_date}-${e.vessel_id}`)
            if(e.shift===1){
                result[`${e.report_date}-${e.vessel_id}`]['morningShift'] = 'Submitted'
            }
            else if(e.shift===2){
                result[`${e.report_date}-${e.vessel_id}`]['eveningShift'] = 'Submitted'
            }
        })
        dlsubmissions.forEach(e=>{
                result[`${e.report_date}-${e.vessel_id}`]['dailyLog'] = 'Submitted'
        })
        result = Object.values(result).filter(e=>e.morningShift==='Not Submitted' || e.eveningShift==='Not Submitted' || e.dailyLog==='Not Submitted')
        return {headers: headers, data: result}
    }
    // async GetVesselReportData(startDate, endDate, vesselId) {
    //     let data = await this.GetLastDayVesselData(startDate, endDate, vesselId);
    //     console.log(data);
    // }
}
module.exports = {
    service : new ExportCSVService()
};