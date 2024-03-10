const config = require('../config/config');
const moment = require('moment');
const {interfaceObj} = require("./interfaces/PostGreSQLInterface");

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
const DAILYELOGMAPPING = {
    engineIdentifier : { col : "engine_identifier", type: "string" },
    carryForwardRunningHour: {col: "carry_forward_running_hour", type: 'decimal'},
    runningHour : {col: "running_hour", type: 'decimal'},
    LNGcarryForwardRunningHour: {col: "lng_carry_forward_running_hour", type: 'decimal'},
    LNGrunningHour : {col: "lng_running_hour", type: 'decimal'},
    totalRunningHour:  {col: "total_running_hour", type: 'decimal'}
}
const ELOGMAPPING = {
    engineIdentifier : { col : "engine_identifier", type: "string" },
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
const DAILYLOGGENERATORMAPPING = {
    carryForwardRunningHour: {col: "carry_forward_running_hour", type: 'decimal'},
    runningHour : {col: "running_hour", type: 'decimal'},
    totalRunningHour:  {col: "total_running_hour", type: 'decimal'},
    generatorIdentifier : { col : "generator_identifier", type: "string" }
}
const GENERATORMAPPING = {
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
const ROBMAP = {
    identifier :  { col : "identifier", type: "string" },
    carryForward: { col : "carry_forward_rob", type: 'decimal' },
    received :  { col : "received", type: "decimal" },
    consumed :  { col : "consumed", type: "decimal" },
    rob :  { col : "rob", type: "decimal" },
}

class VesselDashboardService {
    constructor () {
        this.sqlInterface = interfaceObj
    }
    IsEmpty = val => val===undefined||val===null||val.toString()==='';
    async GetGeneratorStructure(vesselId) {
        var generators = await this.sqlInterface.PerformQueryPromise(`
            SELECT generator_identifier
            FROM ${config.kstConfig.sqlTables.GENERATOR}
            WHERE vessel_id=$1 ORDER BY order_id
        `,[vesselId])
        return generators;
    }
    async GetROBStructure(vesselId) {
        var rob = await this.sqlInterface.PerformQueryPromise(`
            SELECT rob_identifier
            FROM ${config.kstConfig.sqlTables.ROB}
            WHERE vessel_id=$1 ORDER BY order_id
        `,[vesselId])
        return rob;
    }
    async GetVesselReportPageRelatedData(reportId, tablename, mapping, orderByCol) {
        return await this.sqlInterface.GetDataFromTable( tablename, mapping, { form_id : reportId }, orderByCol)
    }
    async GetDailyLogPageRelatedData(reportId, tablename, mapping, orderByCol) {
        return await this.sqlInterface.GetDataFromTable( tablename, mapping, { daily_log_form_id : reportId }, orderByCol)
    }
    async GetLastDayVesselData(vesselId, today){
        var forms = await this.sqlInterface.PerformQueryPromise(`
            SELECT form_id, form_date, report_date, shift FROM ${config.kstConfig.sqlTables.VESSELREPORTFORM} WHERE 
            TO_DATE(report_date, 'DD-MM-YYYY') IN (SELECT MAX(TO_DATE(report_date, 'DD-MM-YYYY')) FROM ${config.kstConfig.sqlTables.VESSELREPORTFORM} WHERE report_date <> $2 AND vessel_id = $1)
            AND vessel_id = $1 AND is_redundant=false
            ORDER BY shift DESC
        `,[vesselId, today]);
        let formData = [];
        if(forms instanceof Array && forms.length>0){
            for(let i=0; i<forms.length;i++){
                let reportId = parseInt(forms[i].form_id);
                let temp = {formDate: forms[i].report_date, shift: forms[i].shift, formId: reportId}
                temp.decklogs = await this.GetVesselReportPageRelatedData(reportId, config.kstConfig.sqlTables.DECKLOG, DECKLOGMAP, "order_priority")
                temp.rob = await this.GetVesselReportPageRelatedData(reportId, config.kstConfig.sqlTables.VESSELREPORTROB, ROBMAP, ROBMAP.identifier.col)
                formData.push(temp);
            }
        }
        return formData;
    }
    async GetLastDayDailyLogData(vesselId, today){
        var forms = await this.sqlInterface.PerformQueryPromise(`
            SELECT form_id, form_date, report_date FROM ${config.kstConfig.sqlTables.DAILYLOGFORM} WHERE 
            TO_DATE(report_date, 'DD-MM-YYYY') IN (SELECT MAX(TO_DATE(report_date, 'DD-MM-YYYY')) FROM ${config.kstConfig.sqlTables.DAILYLOGFORM} WHERE report_date <> $2 AND vessel_id = $1)
            AND vessel_id = $1 AND is_redundant=false
            ORDER BY form_date DESC
        `,[vesselId, today]);
        let formData = [];
        if(forms instanceof Array && forms.length>0){
            for(let i=0; i<forms.length;i++){
                let reportId = parseInt(forms[i].form_id);
                let temp = {formDate: forms[i].report_date, formId: reportId}
                temp.engines = await this.GetDailyLogPageRelatedData(reportId, config.kstConfig.sqlTables.DAILYLOGENGINELOG, DAILYELOGMAPPING, DAILYELOGMAPPING.engineIdentifier.col)
                temp.generators = await this.GetDailyLogPageRelatedData(reportId, config.kstConfig.sqlTables.DAILYLOGGENERATOR, DAILYLOGGENERATORMAPPING, DAILYLOGGENERATORMAPPING.generatorIdentifier.col)
                temp.rob = await this.GetDailyLogPageRelatedData(reportId, config.kstConfig.sqlTables.VESSELREPORTROB, ROBMAP, ROBMAP.identifier.col)
                formData.push(temp);
            }
        }
        return formData;
    }
    async GetLastFiveDayFuelConsumption(vesselId, today){
        let fuelConsumption = [];
        var isRedundant = false;
        var lastDates = await this.sqlInterface.PerformQueryPromise(`
            WITH CTE AS
            (SELECT report_date FROM ${config.kstConfig.sqlTables.VESSELREPORTFORM}
            INTERSECT
            SELECT report_date FROM ${config.kstConfig.sqlTables.DAILYLOGFORM} 
            WHERE vessel_id=$1 AND report_date<>$2 and is_redundant= ${isRedundant})
            SELECT report_date AS form_date FROM CTE ORDER BY TO_DATE(report_date, 'DD-MM-YYYY') DESC LIMIT 5
        `,[vesselId, today]);
        lastDates = lastDates.sort((a,b)=>{
            if(moment(a.form_date, 'DD-MM-YYYY').isBefore(moment(b.form_date, 'DD-MM-YYYY'))){
                return 1;
            }
            else if(moment(a.form_date, 'DD-MM-YYYY').isAfter(moment(b.form_date, 'DD-MM-YYYY'))){
                return -1;
            }
            return 0;
        });
        if(lastDates instanceof Array && lastDates.length>0){
            for(let i=lastDates.length-1; i>=0;i--){
                let formIdsForDay = await this.sqlInterface.PerformQueryPromise(`
                    SELECT form_id FROM ${config.kstConfig.sqlTables.VESSELREPORTFORM} WHERE vessel_id=$1 AND report_date = $2
                `,[vesselId, lastDates[i].form_date]);

                let dailyLogformIdsForDay = await this.sqlInterface.PerformQueryPromise(`
                    SELECT form_id FROM ${config.kstConfig.sqlTables.DAILYLOGFORM} WHERE vessel_id=$1 AND report_date = $2
                `,[vesselId, lastDates[i].form_date]);
                if(formIdsForDay instanceof Array && formIdsForDay.length>0 && dailyLogformIdsForDay instanceof Array && dailyLogformIdsForDay.length>0){
                    let tempData = {
                        date: moment(lastDates[i].form_date, "DD-MM-YYYY").format('DD-MMM'),
                        fuel: 0,
                        lngfuel: 0
                    }
                    let totalFuel = 0;
                    let totalLNGFuel = 0;
                    let totalHours = 0;
                    let totalLNGHours = 0;
                    let robData = await this.GetDailyLogPageRelatedData(dailyLogformIdsForDay[0].form_id, config.kstConfig.sqlTables.DAILYLOGROB, ROBMAP, ROBMAP.identifier.col)
                    for(let j=0; j<formIdsForDay.length; j++){
                        let engineLogData = await this.GetDailyLogPageRelatedData(dailyLogformIdsForDay[0].form_id, config.kstConfig.sqlTables.DAILYLOGENGINELOG, DAILYELOGMAPPING, DAILYELOGMAPPING.engineIdentifier.col)
                        let generatorLogData = await this.GetDailyLogPageRelatedData(dailyLogformIdsForDay[0].form_id, config.kstConfig.sqlTables.DAILYLOGGENERATOR, DAILYLOGGENERATORMAPPING, DAILYLOGGENERATORMAPPING.generatorIdentifier.col)
                        for(let k=0; k<engineLogData.length; k++){
                            totalHours += engineLogData[k].runningHour;
                            totalLNGHours += engineLogData[k].runningHour;
                        }
                        for(let k=0; k<generatorLogData.length; k++){
                            totalHours += generatorLogData[k].runningHour;
                        }
                        for(let k=0; k<robData.length; k++){
                            if(robData[k].identifier==="Fuel Oil")
                            totalFuel += robData[k].consumed;
                        }
                        for(let k=0; k<robData.length; k++){
                            if(robData[k].identifier==="LNG")
                            totalLNGFuel += robData[k].consumed;
                        }
                    }
                    if(totalFuel!==0 && totalHours!==0){
                        tempData.fuel = parseFloat((totalFuel / totalHours).toFixed(2));
                    }
                    if(totalLNGFuel!==0 && totalLNGHours!==0){
                        tempData.lngfuel = parseFloat((totalLNGFuel / totalLNGHours).toFixed(2));
                    }
                    fuelConsumption.push(tempData);
                }
            }
        }
        return fuelConsumption;
    }
    async GetVesselDailyPerformance(vesselId, today){
        let result = {
            deploy: 0,
            move: 0,
            arrive: 0,
            start: 0,
            end: 0,
            date: null,
            total: 0
        };
        let lastDate = await this.sqlInterface.PerformQueryPromise(`
            SELECT MAX(TO_DATE(report_date, 'DD-MM-YYYY')) FROM vessel_report_form WHERE report_date <> $1 AND is_redundant=false
        `, [today])
        lastDate = moment(lastDate[0].max).format('DD-MM-YYYY')
        result.date = lastDate
            let tempResult = {}
            var data = await this.sqlInterface.PerformQueryPromise(`
                SELECT o.order_srt,o.vessel_name,tsd.stage_name, 
                td.from_location , td.to_location,  tsd.stage_time
                FROM marinem_orders o
                LEFT JOIN marinem_task_details td ON o.order_id = td.order_id
                LEFT JOIN marinem_task_stages_details tsd ON tsd.task_id = td.task_id
                LEFT JOIN vessel ON lower(resource_name)=lower(vessel.name)
                WHERE stage_time is not null 
                AND o.order_srt > $2 
                AND o.order_srt < $3
                AND vessel.vessel_id=$1
                order by
                o.order_srt, tsd.stage_time asc;
            `, [vesselId, moment(lastDate, 'DD-MM-YYYY').format('YYYY-MM-DD 07:30:00'), moment(lastDate, 'DD-MM-YYYY').add(1, 'days').format('YYYY-MM-DD 07:30:00')])
            // console.log("here", vessel.vessel_id,vessel.name, data)
            data.forEach(element=>{
                if(tempResult[`${moment(element.order_srt).format("YYYY-MM-DDTHH:mm:ss")}_${element.vessel_name}`]===undefined){
                    tempResult[`${moment(element.order_srt).format("YYYY-MM-DDTHH:mm:ss")}_${element.vessel_name}`] = {}
                }
                tempResult[`${moment(element.order_srt).format("YYYY-MM-DDTHH:mm:ss")}_${element.vessel_name}`][element.stage_name] = element.stage_time
            })
            Object.keys(tempResult)
                .sort((a,b)=>moment(a.split('_')[0], 'YYYY-MM-DDTHH:mm:ss').diff(moment(b.split('_')[0], 'YYYY-MM-DDTHH:mm:ss')))
                .forEach((element, i)=>{
                    tempResult[element]['idx'] = i
                })
            Object.values(tempResult).forEach(element=>{
                if(this.IsEmpty(element.DEPLOY)===false && this.IsEmpty(element.MOVE)===false){
                    result.deploy += moment(element.MOVE).diff(moment(element.DEPLOY), 'minutes')
                    result.total += moment(element.MOVE).diff(moment(element.DEPLOY), 'minutes')
                }
                if(this.IsEmpty(element.MOVE)===false && this.IsEmpty(element.ARRIVE)===false){
                    result.move += moment(element.ARRIVE).diff(moment(element.MOVE), 'minutes')
                    result.total += moment(element.ARRIVE).diff(moment(element.MOVE), 'minutes')
                }
                if(this.IsEmpty(element.ARRIVE)===false && this.IsEmpty(element.START)===false){
                    result.arrive += moment(element.START).diff(moment(element.ARRIVE), 'minutes')
                    result.total += moment(element.START).diff(moment(element.ARRIVE), 'minutes')
                }
                if(this.IsEmpty(element.START)===false && this.IsEmpty(element.END)===false){
                    result.start += moment(element.END).diff(moment(element.START), 'minutes')
                    result.total += moment(element.END).diff(moment(element.START), 'minutes')
                }
                let nextElement = Object.values(tempResult).filter(e=>e.idx===(element.idx+1))
                if(nextElement.length>0 && this.IsEmpty(nextElement[0].DEPLOY)===false){
                    if(this.IsEmpty(element.END)===false){
                        result.end += moment(nextElement[0].DEPLOY).diff(moment(element.END), 'minutes')
                        result.total += moment(nextElement[0].DEPLOY).diff(moment(element.END), 'minutes')
                    }
                }
            })
        console.log(result)
        return result;
    }
    async GetVesselDashboardData(vesselId, today) {
        let lastDayVesselData = await this.GetLastDayVesselData(vesselId, today);
        let lastDayDailyLogData = await this.GetLastDayDailyLogData(vesselId, today);
        let temp = {
            dailyPerformance: {
                deploy: 0,
                move: 0,
                arrive: 0,
                start: 0,
                end: 0,
                date: null,
                total: 0
            },
            fuelConsumptionData: [],
            remainOnBoard: {
                fuelOil: 0,
                freshWater: 0,
                lubOils: []
            },
            runningHours: {
                engines: [
                    {
                        name: 'S',
                        daily: 0,
                        lngdaily: 0,
                        total: 0
                    },
                    {
                        name: 'P',
                        daily: 0,
                        lngdaily: 0,
                        total: 0
                    }
                ],
                generators: [],
            },
            lastRecordedDate: ''
        }
        if(lastDayVesselData instanceof Array && lastDayVesselData.length>0){
            temp.lastRecordedDate = lastDayVesselData[0].formDate;
        }
        if(lastDayDailyLogData instanceof Array && lastDayDailyLogData.length>0){
            temp.remainOnBoard.lastRecordedDate = lastDayDailyLogData[0].formDate;
        }
        let generatorStructure = await this.GetGeneratorStructure(vesselId);
        generatorStructure.forEach(element=>{
            temp.runningHours.generators.push({
                name: element.generator_identifier,
                daily: 0,
                total: 0
            })
        })
        let robStructure = await this.GetROBStructure(vesselId);
        robStructure.forEach(element=>{
            if(element.rob_identifier!=="Fuel Oil" && element.rob_identifier!=="Fresh Water"&& element.rob_identifier!=="LNG"){
                temp.remainOnBoard.lubOils.push({
                    name: element.rob_identifier,
                    value: 0
                })
            }
        })
        let vesselDailyPerformance = await this.GetVesselDailyPerformance(vesselId, today)
        temp.dailyPerformance = {...vesselDailyPerformance}
        if(lastDayDailyLogData.length>0){
            let robData = lastDayDailyLogData[0].rob;
            robData.forEach(robElement=> {
                if(robElement.identifier==="Fuel Oil"){
                    temp.remainOnBoard.fuelOil = robElement.rob;
                }
                else if(robElement.identifier==="Fresh Water"){
                    temp.remainOnBoard.freshWater = robElement.rob;
                }
                else if(robElement.identifier==="LNG"){
                    temp.remainOnBoard.lng = robElement.rob;
                }
                else{
                    temp.remainOnBoard.lubOils.forEach(robStructElement=>{
                        if(robStructElement.name===robElement.identifier){
                            robStructElement.name=robElement.identifier;
                            robStructElement.value=robElement.rob;
                        }
                    })
                }
            });
            lastDayDailyLogData[0].engines.forEach(element=>{
                temp.runningHours.engines.forEach(engElement=>{
                    if(engElement.name===element.engineIdentifier){
                        engElement.daily += element.runningHour;
                        engElement.lngdaily += element.LNGrunningHour;
                    }
                })
            })

            lastDayDailyLogData[0].generators.forEach(element=>{
                temp.runningHours.generators.forEach(genElement=>{
                    if(genElement.name===element.generatorIdentifier){
                        genElement.daily += element.runningHour
                    }
                })
            })
            
        }
        if(lastDayDailyLogData instanceof Array && lastDayDailyLogData.length>0){
            let engineData = lastDayDailyLogData[0].engines;
            engineData.forEach(engDataElement=>{
                temp.runningHours.engines.forEach(engElement=>{
                    if(engElement.name===engDataElement.engineIdentifier){
                        engElement.total = engDataElement.totalRunningHour
                    }
                })
            })
    
            let generatorData = lastDayDailyLogData[0].generators;
            generatorData.forEach(genDataElement=>{
                temp.runningHours.generators.forEach(genElement=>{
                    if(genElement.name===genDataElement.generatorIdentifier){
                        genElement.total = genDataElement.totalRunningHour
                    }
                })
            })
        }
        temp.fuelConsumptionData = await this.GetLastFiveDayFuelConsumption(vesselId, today);
        return temp;
    }

    async GetVesselDashboardLastFiveMarinemData(vesselId) {
        try {
            var marinemList = [];
            let lastFiveVesselReportList = await this.sqlInterface.PerformQueryPromise(`
                select report_date as reportdate from ${config.kstConfig.sqlTables.VESSELREPORTFORM} where is_redundant=$2 and vessel_id=$1 GROUP BY reportdate order by TO_DATE(report_date,'DD-MM-YYYY') desc limit 5;
            `, [vesselId, false]);

            if (lastFiveVesselReportList && lastFiveVesselReportList.length > 0) {
                for(const vessel of lastFiveVesselReportList) {
                    let result = {
                        deploy: 0,
                        move: 0,
                        arrive: 0,
                        start: 0,
                        end: 0,
                        total: 0,
                        date: null,
                    };
                    result.date = vessel.reportdate;
                    let tempResult = {};
                    var data = await this.sqlInterface.PerformQueryPromise(`
                        SELECT o.order_srt,o.vessel_name,tsd.stage_name, 
                        td.from_location , td.to_location,  tsd.stage_time
                        FROM marinem_orders o
                        LEFT JOIN marinem_task_details td ON o.order_id = td.order_id
                        LEFT JOIN marinem_task_stages_details tsd ON tsd.task_id = td.task_id
                        LEFT JOIN vessel ON lower(resource_name)=lower(vessel.name)
                        WHERE stage_time is not null 
                        AND o.order_srt > $2 
                        AND o.order_srt < $3
                        AND vessel.vessel_id=$1
                        order by
                        o.order_srt, tsd.stage_time asc;
                    `, [vesselId, moment(vessel.reportdate, 'DD-MM-YYYY').format('YYYY-MM-DD 07:30:00'), moment(vessel.reportdate, 'DD-MM-YYYY').add(1, 'days').format('YYYY-MM-DD 07:30:00')])
                    data.forEach(element=>{
                        if(tempResult[`${moment(element.order_srt).format("YYYY-MM-DDTHH:mm:ss")}_${element.vessel_name}`]===undefined){
                            tempResult[`${moment(element.order_srt).format("YYYY-MM-DDTHH:mm:ss")}_${element.vessel_name}`] = {}
                        }
                        tempResult[`${moment(element.order_srt).format("YYYY-MM-DDTHH:mm:ss")}_${element.vessel_name}`][element.stage_name] = element.stage_time
                    })
                    Object.keys(tempResult)
                        .sort((a,b)=>moment(a.split('_')[0], 'YYYY-MM-DDTHH:mm:ss').diff(moment(b.split('_')[0], 'YYYY-MM-DDTHH:mm:ss')))
                        .forEach((element, i)=>{
                            tempResult[element]['idx'] = i
                        })
                    Object.values(tempResult).forEach(element=>{
                        if(this.IsEmpty(element.DEPLOY)===false && this.IsEmpty(element.MOVE)===false){
                            result.deploy += moment(element.MOVE).diff(moment(element.DEPLOY), 'minutes')
                            result.total += moment(element.MOVE).diff(moment(element.DEPLOY), 'minutes')
                        }
                        if(this.IsEmpty(element.MOVE)===false && this.IsEmpty(element.ARRIVE)===false){
                            result.move += moment(element.ARRIVE).diff(moment(element.MOVE), 'minutes')
                            result.total += moment(element.ARRIVE).diff(moment(element.MOVE), 'minutes')
                        }
                        if(this.IsEmpty(element.ARRIVE)===false && this.IsEmpty(element.START)===false){
                            result.arrive += moment(element.START).diff(moment(element.ARRIVE), 'minutes')
                            result.total += moment(element.START).diff(moment(element.ARRIVE), 'minutes')
                        }
                        if(this.IsEmpty(element.START)===false && this.IsEmpty(element.END)===false){
                            result.start += moment(element.END).diff(moment(element.START), 'minutes')
                            result.total += moment(element.END).diff(moment(element.START), 'minutes')
                        }
                        let nextElement = Object.values(tempResult).filter(e=>e.idx===(element.idx+1))
                        if(nextElement.length>0 && this.IsEmpty(nextElement[0].DEPLOY)===false){
                            if(this.IsEmpty(element.END)===false){
                                result.end += moment(nextElement[0].DEPLOY).diff(moment(element.END), 'minutes')
                                result.total += moment(nextElement[0].DEPLOY).diff(moment(element.END), 'minutes')
                            }
                        }
                    })
                    marinemList.push(result);
                };
            }
            return marinemList;
        } catch (error) {
            throw new Error(error);
        }
    }
}
module.exports = {
    service : new VesselDashboardService()
}