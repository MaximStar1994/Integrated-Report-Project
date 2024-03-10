const config = require('../config/config')
const helper = require('../helper/helperWithoutApi')
const {interfaceObj} = require("./interfaces/PostGreSQLInterface")
const moment = require('moment-timezone')
class HealthCheckService {
    constructor () {
        this.sqlInterface = interfaceObj
    }
    async HealthCheck() {
        let isRedundant = false;
        let health = {
            vesselReportForm: {
                name: 'Vessel Report Form',
                reportsGenerated: true,
                lastUpdate: '',
                formCounts: []
            },
            dailyLogForm: {
                name: 'Daily Log',
                reportsGenerated: true,
                lastUpdate: '',
                formCounts: []
            },
            crewWorkRestHour: {
                name: 'Seafarer\'s Record of Hours of Rest',
                reportsGenerated: true,
                lastUpdate: '',
                formCounts: []
            },
            crewDailyTemperature: {
                name: 'Crew Daily Temperature Report',
                reportsGenerated: true,
                lastUpdate: '',
                formCounts: []
            },
            vesselDisinfection: {
                name: 'Vessel Disinfection Record',
                reportsGenerated: true,
                lastUpdate: '',
                formCounts: []
            },
            vesselDowntime: {
                name: 'Vessel Downtime Record Form',
                reportsGenerated: true,
                lastUpdate: '',
                formCounts: []
            },
            crewPlanning: {
                name: 'Crew Planning',
                reportsGenerated: true,
                lastUpdate: '',
                formCounts: []
            }
        }
        let vrfreport = await this.sqlInterface.PerformQueryPromise(`
            SELECT * from ${config.kstConfig.sqlTables.VESSELREPORTFORM} WHERE file_path IS NULL OR file_path=''
        `,[]);
        if(vrfreport && vrfreport.length>0){
            health.vesselReportForm.reportsGenerated = false;
        }
        let vrfLastUpdate = await this.sqlInterface.PerformQueryPromise(`
            SELECT form_date from ${config.kstConfig.sqlTables.VESSELREPORTFORM} ORDER BY form_date DESC LIMIT 1
        `,[]);
        if(vrfLastUpdate && vrfLastUpdate.length>0){
            health.vesselReportForm.lastUpdate = vrfLastUpdate[0].form_date;
        }


        let dlreport = await this.sqlInterface.PerformQueryPromise(`
            SELECT * from ${config.kstConfig.sqlTables.DAILYLOGFORM} WHERE file_path IS NULL OR file_path=''
        `,[]);
        if(dlreport && dlreport.length>0){
            health.dailyLogForm.reportsGenerated = false;
        }
        let dlLastUpdate = await this.sqlInterface.PerformQueryPromise(`
            SELECT form_date from ${config.kstConfig.sqlTables.DAILYLOGFORM} ORDER BY form_date DESC LIMIT 1
        `,[]);
        if(dlLastUpdate && dlLastUpdate.length>0){
            health.dailyLogForm.lastUpdate = dlLastUpdate[0].form_date;
        }

        let vdtreport = await this.sqlInterface.PerformQueryPromise(`
            SELECT * from ${config.kstConfig.sqlTables.VESSELBREAKDOWNEVENT} WHERE (file_path IS NULL OR file_path='') AND status='closed'
        `,[]);
        if(vdtreport && vdtreport.length>0){
            health.vesselDowntime.reportsGenerated = false;
        }

        let cwrreport = await this.sqlInterface.PerformQueryPromise(`
            SELECT * from ${config.kstConfig.sqlTables.CREWWORKREST} WHERE file_path IS NULL OR file_path=''
        `,[]);
        if(cwrreport && cwrreport.length>0){
            health.crewWorkRestHour.reportsGenerated = false;
        }
        let cwrLastUpdate = await this.sqlInterface.PerformQueryPromise(`
            SELECT date_submitted from ${config.kstConfig.sqlTables.CREWWORKREST} ORDER BY date_submitted DESC LIMIT 1
        `,[]);
        if(cwrLastUpdate && cwrLastUpdate.length>0){
            health.crewWorkRestHour.lastUpdate = cwrLastUpdate[0].date_submitted;
        }

        let cdtreport = await this.sqlInterface.PerformQueryPromise(`
            SELECT * from ${config.kstConfig.sqlTables.TEMPERATURELOG} WHERE file_path IS NULL OR file_path=''
        `,[]);
        if(cdtreport && cdtreport.length>0){
            health.crewDailyTemperature.reportsGenerated = false;
        }
        let cdtLastUpdate = await this.sqlInterface.PerformQueryPromise(`
            SELECT date_submitted from ${config.kstConfig.sqlTables.TEMPERATURELOG} ORDER BY date_submitted DESC LIMIT 1
        `,[]);
        if(cdtLastUpdate && cdtLastUpdate.length>0){
            health.crewDailyTemperature.lastUpdate = cdtLastUpdate[0].date_submitted;
        }
        
        let vdreport = await this.sqlInterface.PerformQueryPromise(`
            SELECT * from ${config.kstConfig.sqlTables.VESSELDISINFECTION} WHERE file_path IS NULL OR file_path=''
        `,[]);
        if(vdreport && vdreport.length>0){
            health.vesselDisinfection.reportsGenerated = false;
        }
        let vdLastUpdate = await this.sqlInterface.PerformQueryPromise(`
            SELECT date_submitted from ${config.kstConfig.sqlTables.VESSELDISINFECTION} ORDER BY date_submitted DESC LIMIT 1
        `,[]);
        if(vdLastUpdate && vdLastUpdate.length>0){
            health.vesselDisinfection.lastUpdate = vdLastUpdate[0].date_submitted;
        }



        let vesselReportFormLastDays = await this.sqlInterface.PerformQueryPromise(`
            SELECT DISTINCT(report_date), TO_DATE(report_date, 'DD-MM-YYYY') from ${config.kstConfig.sqlTables.VESSELREPORTFORM} ORDER BY TO_DATE(report_date, 'DD-MM-YYYY') DESC LIMIT 10
        `,[]);
        if(vesselReportFormLastDays && vesselReportFormLastDays.length>0){
            let vesselReportFormLastDaysString = '';
            vesselReportFormLastDays.forEach((element, idx)=>vesselReportFormLastDaysString+=`'${element.report_date}'${idx!==vesselReportFormLastDays.length-1?', ':''}`);
            let vesselReportFormCount = await this.sqlInterface.PerformQueryPromise(`
                SELECT vrf.report_date, vrf.vessel_id, v.name, COUNT(*)  AS submissions FROM ${config.kstConfig.sqlTables.VESSELREPORTFORM} vrf LEFT JOIN ${config.kstConfig.sqlTables.VESSEL} v ON vrf.vessel_id=v.vessel_id
                WHERE is_redundant=${isRedundant}
                GROUP BY vrf.report_date, vrf.vessel_id, v.name
                HAVING report_date IN
                (${vesselReportFormLastDaysString})
                ORDER BY report_date DESC
            `,[]);
            let returnData = [];
            vesselReportFormCount.forEach(element=>{
                let idx = returnData.findIndex(e=>element.report_date===e.reportDate);
                if(idx===-1){
                    returnData.push({
                        reportDate: element.report_date,
                        submissions: parseFloat(element.submissions),
                        vessels: [{
                            vesselId: element.vessel_id,
                            name: element.name,
                            submissions: element.submissions
                        }]
                    });
                }
                else{
                    returnData[idx].submissions += parseFloat(element.submissions);
                    returnData[idx].vessels.push({
                        vesselId: element.vessel_id,
                        name: element.name,
                        submissions: element.submissions
                    });
                }
            });
            health.vesselReportForm.formCounts = returnData;
        }
        let dailyLogFormLastDays = await this.sqlInterface.PerformQueryPromise(`
            SELECT DISTINCT(report_date), TO_DATE(report_date, 'DD-MM-YYYY') from ${config.kstConfig.sqlTables.DAILYLOGFORM} ORDER BY TO_DATE(report_date, 'DD-MM-YYYY') DESC LIMIT 10
        `,[]);
        if(dailyLogFormLastDays && dailyLogFormLastDays.length>0){
            let dailyLogFormLastDaysString = '';
            dailyLogFormLastDays.forEach((element, idx)=>dailyLogFormLastDaysString+=`'${element.report_date}'${idx!==dailyLogFormLastDays.length-1?', ':''}`);
            let dailyLogFormCount = await this.sqlInterface.PerformQueryPromise(`
                SELECT dl.report_date, dl.vessel_id, v.name, COUNT(*)  AS submissions FROM ${config.kstConfig.sqlTables.DAILYLOGFORM} dl LEFT JOIN ${config.kstConfig.sqlTables.VESSEL} v ON dl.vessel_id=v.vessel_id
                WHERE is_redundant=${isRedundant}
                GROUP BY dl.report_date, dl.vessel_id, v.name
                HAVING report_date IN
                (${dailyLogFormLastDaysString})
                ORDER BY report_date DESC
            `,[]);
            let returnData = [];
            dailyLogFormCount.forEach(element=>{
                let idx = returnData.findIndex(e=>element.report_date===e.reportDate);
                if(idx===-1){
                    returnData.push({
                        reportDate: element.report_date,
                        submissions: parseFloat(element.submissions),
                        vessels: [{
                            vesselId: element.vessel_id,
                            name: element.name,
                            submissions: element.submissions
                        }]
                    });
                }
                else{
                    returnData[idx].submissions += parseFloat(element.submissions);
                    returnData[idx].vessels.push({
                        vesselId: element.vessel_id,
                        name: element.name,
                        submissions: element.submissions
                    });
                }
            });
            health.dailyLogForm.formCounts = returnData;
        }
        let restHoursFormLastDays = await this.sqlInterface.PerformQueryPromise(`
            SELECT DISTINCT(TO_CHAR(date_submitted, 'dd-mm-yyyy')) as report_date, date_submitted from ${config.kstConfig.sqlTables.CREWWORKREST} ORDER BY date_submitted DESC LIMIT 10
        `,[]);
        if(restHoursFormLastDays && restHoursFormLastDays.length>0){
            let restHoursFormLastDaysString = '';
            restHoursFormLastDays.forEach((element, idx)=>restHoursFormLastDaysString+=`'${element.report_date}'${idx!==restHoursFormLastDays.length-1?', ':''}`);
            let restHoursFormCount = await this.sqlInterface.PerformQueryPromise(`
                SELECT TO_CHAR(date_submitted, 'dd-mm-yyyy') as report_date, COUNT(*)  AS submissions FROM ${config.kstConfig.sqlTables.CREWWORKREST}
                GROUP BY TO_CHAR(date_submitted, 'dd-mm-yyyy')
                HAVING TO_CHAR(date_submitted, 'dd-mm-yyyy') IN
                (${restHoursFormLastDaysString})
                ORDER BY TO_CHAR(date_submitted, 'dd-mm-yyyy') DESC
            `,[]);
            restHoursFormCount.forEach(element=>health.crewWorkRestHour.formCounts.push({
                reportDate: element.report_date,
                submissions: element.submissions,
            }));
        }
        let dailyTemperature = await this.sqlInterface.PerformQueryPromise(`
            SELECT DISTINCT(TO_CHAR(date_submitted, 'dd-mm-yyyy')) as report_date, date_submitted from ${config.kstConfig.sqlTables.TEMPERATURELOG} ORDER BY date_submitted DESC LIMIT 10
        `,[]);
        if(dailyTemperature && dailyTemperature.length>0){
            let dailyTemperatureString = '';
            dailyTemperature.forEach((element, idx)=>dailyTemperatureString+=`'${element.report_date}'${idx!==dailyTemperature.length-1?', ':''}`);
            let dailyTempFormCount = await this.sqlInterface.PerformQueryPromise(`
                SELECT TO_CHAR(date_submitted, 'dd-mm-yyyy') as report_date, COUNT(*)  AS submissions FROM ${config.kstConfig.sqlTables.TEMPERATURELOG}
                GROUP BY TO_CHAR(date_submitted, 'dd-mm-yyyy')
                HAVING TO_CHAR(date_submitted, 'dd-mm-yyyy') IN
                (${dailyTemperatureString})
                ORDER BY TO_CHAR(date_submitted, 'dd-mm-yyyy') DESC
            `,[]);
            dailyTempFormCount.forEach(element=>health.crewDailyTemperature.formCounts.push({
                reportDate: element.report_date,
                submissions: element.submissions,
            }));
        }
        let disinfectionRecord = await this.sqlInterface.PerformQueryPromise(`
            SELECT DISTINCT(TO_CHAR(date_submitted, 'dd-mm-yyyy')) as report_date, date_submitted from ${config.kstConfig.sqlTables.VESSELDISINFECTION} ORDER BY date_submitted DESC LIMIT 10
        `,[]);

        if(disinfectionRecord && disinfectionRecord.length>0){
            let disinfectionRecordString = '';
            disinfectionRecord.forEach((element, idx)=>disinfectionRecordString+=`'${element.report_date}'${idx!==disinfectionRecord.length-1?', ':''}`);
            let disinfectionRecordFormCount = await this.sqlInterface.PerformQueryPromise(`
                SELECT TO_CHAR(date_submitted, 'dd-mm-yyyy') as report_date, COUNT(*)  AS submissions FROM ${config.kstConfig.sqlTables.VESSELDISINFECTION}
                GROUP BY TO_CHAR(date_submitted, 'dd-mm-yyyy')
                HAVING TO_CHAR(date_submitted, 'dd-mm-yyyy') IN
                (${disinfectionRecordString})
                ORDER BY TO_CHAR(date_submitted, 'dd-mm-yyyy') DESC
            `,[]);
            disinfectionRecordFormCount.forEach(element=>health.vesselDisinfection.formCounts.push({
                reportDate: element.report_date,
                submissions: element.submissions,
            }));
        }
        return health;
    }
}
module.exports = {
    service : new HealthCheckService(),
}