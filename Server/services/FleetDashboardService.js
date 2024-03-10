const config = require('../config/config');
const moment = require('moment');
const momentTimeZone = require('moment-timezone')
const {interfaceObj} = require("./interfaces/PostGreSQLInterface");

const DECKLOGMAP = {
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
class FleetDashboardService {
    constructor () {
        this.sqlInterface = interfaceObj
    }
    IsEmpty = val => val===undefined||val===null||val.toString()==='';
    async GetVesselReportPageRelatedData(reportId, tablename, mapping, orderByCol) {
        return await this.sqlInterface.GetDataFromTable( tablename, mapping, { form_id : reportId }, orderByCol)
    }
    async GetVesselStructure(){
        var vessels = await this.sqlInterface.PerformQueryPromise(`
            SELECT vessel_id, name FROM ${config.kstConfig.sqlTables.VESSEL} ORDER BY vessel_id
        `,[]);
        return vessels;
    }
    async GetLastDayData(today){
        var forms = await this.sqlInterface.PerformQueryPromise(`
            SELECT form_id, form_date, shift, report_date FROM ${config.kstConfig.sqlTables.VESSELREPORTFORM} WHERE 
            TO_DATE(report_date, 'DD-MM-YYYY') IN (SELECT MAX(TO_DATE(report_date, 'DD-MM-YYYY')) FROM ${config.kstConfig.sqlTables.VESSELREPORTFORM} WHERE report_date <> $1 AND is_redundant=false) AND is_redundant=false
        `,[today]);
        let formData = [];
        if(forms instanceof Array && forms.length>0){
            for(let i=0; i<forms.length;i++){
                let reportId = parseInt(forms[i].form_id);
                let temp = {formDate: forms[i].form_date, shift: forms[i].shift, formId: reportId, reportDate: forms[i].report_date}
                temp.decklogs = await this.GetVesselReportPageRelatedData(reportId, config.kstConfig.sqlTables.DECKLOG, DECKLOGMAP, "order_priority")
                formData.push(temp);
            }
        }
        return formData;
    }
    async GetLastMonthBreakdownData(month, year) {
        var isRedundant = false;
        var breakdowns = await this.sqlInterface.PerformQueryPromise(`
            SELECT vessel_id, vessel_name, breakdown_datetime, back_to_operation_datetime, reason, category FROM 
            ${config.kstConfig.sqlTables.VESSELBREAKDOWNEVENT} e LEFT JOIN ${config.kstConfig.sqlTables.VESSELBREAKDOWNSUPT} s ON e.event_id=s.event_id 
            WHERE status='closed' AND vessel_condition='Non Operational' AND is_redundant=$3 AND
            EXTRACT('year' FROM breakdown_datetime) = $2 AND
            EXTRACT('month' FROM breakdown_datetime) = $1
        `,[month, year, isRedundant]);
        if(breakdowns instanceof Array && breakdowns.length>0){
            for(let i=0; i<breakdowns.length;i++){
                breakdowns[i].duration = moment.duration(moment(breakdowns[i].back_to_operation_datetime).diff(moment(breakdowns[i].breakdown_datetime))).asHours();
            }
        }
        return breakdowns;
    }
    async GetOpenBreakdownCases(){
        var breakdowns = await this.sqlInterface.PerformQueryPromise(`
            SELECT vessel_id, vessel_name FROM ${config.kstConfig.sqlTables.VESSELBREAKDOWNEVENT} WHERE status = 'open'
        `,[])
        return breakdowns;
    }
    async GetTodayFleetStatus(){
        let timeStampToUse = moment();
        if(moment().isBefore(
            moment().set('hour', 8).set('minute', 30).set('second', 0).set('millisecond', 0)
        )){
            timeStampToUse.subtract(1, 'day');
        }
        var fleetStatus = await this.sqlInterface.PerformQueryPromise(`
            SELECT vessel_id, form_id, shift FROM ${config.kstConfig.sqlTables.VESSELREPORTFORM} WHERE report_date = $1
        `, [timeStampToUse.format('DD-MM-YYYY')])
        return {fleetStatus: fleetStatus, fleetStatusDate: timeStampToUse.format('DD-MM-YYYY')};
    }
    async GetFleetDailyPerformance(today){
        let vessels = await this.GetVesselStructure();
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
        for(let i=0; i<vessels.length; i++){
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
            `, [vessels[i].vessel_id, moment(lastDate, 'DD-MM-YYYY').format('YYYY-MM-DD 07:30:00'), moment(lastDate, 'DD-MM-YYYY').add(1, 'days').format('YYYY-MM-DD 07:30:00')])
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
            console.log(vessels[i].vessel_id, tempResult)
        }
        console.log(result)
        return result;
    }
    async GetFleetDashboardData(today) {
        let temp = {
            dailyPerformance: {
                deploy: 0,
                move: 0,
                arrive: 0,
                start: 0,
                end: 0,
                date: null
            },
            downtime: {
                lastMonthTopContributers: [],
                downtime: [
                    {name: 'Survey', value: 0},
                    {name: 'Planned Maintenance Work', value: 0},
                    {name: 'Machinery Breakdown', value: 0},
                    {name: 'Incident', value: 0},
                    {name: 'Crewing', value: 0},
                    {name: 'Operation', value: 0},
                    {name: 'Others', value: 0}
                ],
                breakdownData: []
            },
            fleets: [],
            fleetStatusDate: null,
        }
        let vesselStructure = await this.GetVesselStructure();
        vesselStructure.forEach(element=>{
            temp.downtime.lastMonthTopContributers.push({id: element.vessel_id, name: element.name, value: 0});
            temp.fleets.push({id: element.vessel_id, name: element.name, status: false, am: false, pm: false});
        })
        let dailyPerformance = await this.GetFleetDailyPerformance(today);
        temp.dailyPerformance = {...dailyPerformance}
        
        let todayDateRec = moment(today, 'DD-MM-YYYY');
        let lastMonth = todayDateRec.month()+1;
        let lastMonthYear = todayDateRec.year();
        if(lastMonth===1){
            lastMonth=12;
            lastMonthYear-=1;
        }
        else{
            lastMonth-=1;
        }
        let lastMonthBreakdownData = await this.GetLastMonthBreakdownData(lastMonth, lastMonthYear);
        temp.downtime.breakdownDataMonth = lastMonth;
        temp.downtime.breakdownDataYear = lastMonthYear;
        lastMonthBreakdownData.forEach(breakdownDataElement=>{
            temp.downtime.breakdownData.push({
                vesselId: breakdownDataElement.vessel_id,
                vesselName: breakdownDataElement.vessel_name,
                breakdownDatetime: breakdownDataElement.breakdown_datetime,
                backToOperationDatetime: breakdownDataElement.back_to_operation_datetime,
                category: breakdownDataElement.category,
                reason: breakdownDataElement.reason
            })
        })
        let totalDowntime = 0;
        lastMonthBreakdownData.forEach(element=>{
            temp.downtime.downtime.forEach(downtimeElement=>{
                if(downtimeElement.name===element.category){
                    downtimeElement.value+=element.duration
                }
            })
            totalDowntime+=element.duration

            temp.downtime.lastMonthTopContributers.forEach(topContElement=>{
                if(topContElement.id===element.vessel_id){
                    topContElement.value+=element.duration
                }
            })

        })
        temp.downtime.downtime.forEach(downtimeElement=>{
            if(downtimeElement.value!==0 || totalDowntime!==0){
                downtimeElement.value=parseFloat(((downtimeElement.value/totalDowntime)*100).toFixed(0))
            }
        })
        let tempDowntime = [];
        temp.downtime.downtime.forEach(downtimeElement=>{
            if(downtimeElement.value!==0){
                tempDowntime.push(downtimeElement);
            }
        })
        temp.downtime.downtime = tempDowntime;
        for(let count=0; count<temp.downtime.downtime.length; count++){}
        temp.downtime.lastMonthTopContributers = temp.downtime.lastMonthTopContributers.sort((a,b)=>b.value-a.value).slice(0,3);
        temp.downtime.lastMonthTopContributers.forEach(topContElement=>{
            topContElement.value = parseFloat((moment.duration(topContElement.value, 'hours').asDays()).toFixed(2))
        })
        let openBreakdown = await this.GetOpenBreakdownCases();
        openBreakdown.forEach(openElements=>{
            temp.fleets.forEach(fleetElement=>{
                if(openElements.vessel_id===fleetElement.id){
                    fleetElement.status = true;
                }
            })
        })
        let checkMorningShift = false;
        let checkEveningShift = false;
        if(moment().isBefore(moment().set('hour', 8).set('minute', 30).set('second', 0).set('millisecond', 0))===true||
            moment().isAfter(moment().set('hour', 19).set('minute', 30).set('second', 0).set('millisecond', 0))===true){
            checkMorningShift = true;
        }
        if(moment().isBefore(moment().set('hour', 8).set('minute', 30).set('second', 0).set('millisecond', 0))===true &&
            moment().isAfter(moment().set('hour', 7).set('minute', 30).set('second', 0).set('millisecond', 0))===true){
            checkEveningShift = true;
        }
        let fleetStatus = await this.GetTodayFleetStatus();
        temp.fleetStatusDate = fleetStatus.fleetStatusDate;
        fleetStatus = fleetStatus.fleetStatus;
        temp.fleets.forEach(fleetElement=>{
            if(checkMorningShift===true){
                fleetElement.am=true;
            }
            if(checkEveningShift===true){
                fleetElement.pm=true;
            }
            fleetStatus.forEach(element=>{
                if(element.vessel_id===fleetElement.id){
                    if(element.shift===1){
                        fleetElement.am=false;
                    }
                    else if(element.shift===2){
                        fleetElement.pm=false;
                    }
                }
            })
        })

        return temp;
    }

    async GetFleetDashboardLastFiveMarinemData() {
        try {
            var marinemList = [];
            const TIMEZONE = config.TIMEZONE;
            let currentDateWithZone = momentTimeZone.tz(new Date(), TIMEZONE).format("DD-MM-YYYY");
            let vessels = await this.GetVesselStructure();
            let lastFiveVesselReportList = await this.sqlInterface.PerformQueryPromise(`
                select report_date as reportdate from ${config.kstConfig.sqlTables.VESSELREPORTFORM} where is_redundant=$1 and TO_DATE(report_date,'DD-MM-YYYY') <> TO_DATE($2,'DD-MM-YYYY') GROUP BY reportdate order by TO_DATE(report_date,'DD-MM-YYYY') desc limit 5;
            `, [false,currentDateWithZone]);
            if (lastFiveVesselReportList && lastFiveVesselReportList.length > 0) {
                for (const vr of lastFiveVesselReportList) {
                    let result = {
                        deploy: 0,
                        move: 0,
                        arrive: 0,
                        start: 0,
                        end: 0,
                        date: null,
                        total: 0
                    };
                    result.date = vr.reportdate;
                    for(let i=0; i<vessels.length; i++) {
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
                        `, [vessels[i].vessel_id, moment(vr.reportdate, 'DD-MM-YYYY').format('YYYY-MM-DD 07:30:00'), moment(vr.reportdate, 'DD-MM-YYYY').add(1, 'days').format('YYYY-MM-DD 07:30:00')])
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
                        console.log(vessels[i].vessel_id, tempResult)
                    }
                    result.deploy = result.deploy !== 0 ? parseFloat(((result.deploy / result.total) * 100).toFixed(2)) : 0;
                    result.move   = result.move   !== 0 ? parseFloat(((result.move / result.total) * 100).toFixed(2))   : 0;
                    result.arrive = result.arrive !== 0 ? parseFloat(((result.arrive / result.total) * 100).toFixed(2)) : 0;
                    result.start  = result.start  !== 0 ? parseFloat(((result.start / result.total) * 100).toFixed(2))  : 0;
                    result.end    = result.end    !== 0 ? parseFloat(((result.end / result.total) * 100).toFixed(2))    : 0;
                    marinemList.push(result);
                }
            }
            return marinemList;
        } catch (error) {
            throw new Error(error);
        }
    }
}
module.exports = {
    service : new FleetDashboardService()
}