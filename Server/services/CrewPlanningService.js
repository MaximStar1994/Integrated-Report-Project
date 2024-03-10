const config = require('../config/config');
const {interfaceObj} = require("./interfaces/PostGreSQLInterface")
const { uuid } = require('uuidv4');
const pagekey = "CREWPLANNING";
class CrewPlanningService {
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
    async LockCrewPlanningPage(user) {
        var lock = uuid()
        await this.sqlInterface.PerformUpdatePromise(config.kstConfig.sqlTables.LOCK, {
            pagelock : lock,
            currentuser: user
        },{
            page : pagekey
        })
        return lock
    }
    async CanViewCrewPlanningPage(userlock) {
        let currentlock = await this.sqlInterface.PerformQueryPromise(`
            SELECT pagelock
            FROM ${config.kstConfig.sqlTables.LOCK}
            WHERE page='${pagekey}'
        `,[])
        if (currentlock instanceof Array && currentlock.length > 0) {
            currentlock = currentlock[0].pagelock
            return currentlock === userlock||currentlock==null
        } else {
            return false
        }
    }
    async GetCurrentUser() {
        let currentUser = await this.sqlInterface.PerformQueryPromise(`
            SELECT currentuser
            FROM ${config.kstConfig.sqlTables.LOCK}
            WHERE page='${pagekey}'
        `,[])
        if (currentUser instanceof Array && currentUser.length > 0) {
            return currentUser[0].currentuser
        } else {
            return ''
        }
    }
    async UnlockCrewPlanningPage() {
        await this.sqlInterface.PerformQueryPromise(`
            UPDATE ${config.kstConfig.sqlTables.LOCK}
            SET (pagelock,currentuser) = (NULL,NULL)
            WHERE page='${pagekey}'
            RETURNING *;
        `,[])
        return true
    }
    getTrimData(data){
        if(typeof(data)==='string'){
            return data.trim()
        }
        else{
            return data;
        }
    }
    async GetCrewPlanningData() {
        let crewPlanningData = [];
        let vessels = await this.sqlInterface.PerformQueryPromise(`
            SELECT vessel_id, name, shift, ops, location, timezone, optimum_crew 
            FROM ${config.kstConfig.sqlTables.VESSEL} ORDER BY crew_management_order_id
        `,[])
        if (vessels instanceof Array && vessels.length > 0) {
            let totalOptimumCrew = 0;
            for(let i=0; i<vessels.length; i++){
                totalOptimumCrew += vessels[i].optimum_crew;
                let vesselCrew = await this.sqlInterface.PerformQueryPromise(`
                SELECT crew_id, name, rank, nationality, remarks, employee_no, joining_date, months_as_of_31jul2021
                FROM ${config.kstConfig.sqlTables.CREW} WHERE vessel_id = ${vessels[i].vessel_id} ORDER BY crew_id
                `, [])
                if(vesselCrew instanceof Array && vesselCrew.length > 0){
                    let temp = [];
                    for(let j=0; j<vesselCrew.length; j++){
                        temp.push({
                            crewId : vesselCrew[j].crew_id,
                            name : this.getTrimData(vesselCrew[j].name),
                            rank : vesselCrew[j].rank,
                            nationality : vesselCrew[j].nationality,
                            remarks : vesselCrew[j].remarks,
                            employeeNo : this.getTrimData(vesselCrew[j].employee_no),
                            joiningDate : vesselCrew[j].joining_date,
                            monthsAsOf31Jul2021: parseInt(vesselCrew[j].months_as_of_31jul2021)
                        })
                    }
                    vesselCrew = temp;
                }
                else {
                    vesselCrew = [];
                }
                crewPlanningData.push({
                    vesselId : vessels[i].vessel_id,
                    name : vessels[i].name,
                    shift: vessels[i].shift,
                    ops: vessels[i].ops,
                    location: vessels[i].location,
                    timezone : vessels[i].timezone,
                    optimumCrew : parseInt(vessels[i].optimum_crew),
                    crew : vesselCrew
                })
            }
            return {crewPlanningData: crewPlanningData, totalOptimumCrew: totalOptimumCrew};
        } else {
            return null
        }
    }
    async UpdateCrewPlanningData(crewPlanningData) {
        if (crewPlanningData instanceof Array && crewPlanningData.length > 0) {
            for(let i=0; i<crewPlanningData.length; i++){
                
                await this.sqlInterface.PerformQueryPromise(`
                UPDATE ${config.kstConfig.sqlTables.VESSEL} SET name=$2, shift=$3, ops=$4, location=$5, optimum_crew=$6  WHERE vessel_id = $1
                `, [crewPlanningData[i]['vesselId'], crewPlanningData[i]['name'], crewPlanningData[i]['shift'], crewPlanningData[i]['ops'], crewPlanningData[i]['location'], crewPlanningData[i]['optimumCrew']]);
                if(crewPlanningData[i].crew instanceof Array && crewPlanningData[i].crew.length > 0){
                    for(let j=0; j<crewPlanningData[i].crew.length; j++){
                        await this.sqlInterface.PerformQueryPromise(`
                        UPDATE ${config.kstConfig.sqlTables.CREW} SET name=$2, rank=$3, nationality=$4, remarks=$5, employee_no=$6, joining_date=$7, months_as_of_31jul2021=$8 WHERE crew_id = $1
                        `, [crewPlanningData[i]['crew'][j]['crewId'], crewPlanningData[i]['crew'][j]['name'], crewPlanningData[i]['crew'][j]['rank'], crewPlanningData[i]['crew'][j]['nationality'], crewPlanningData[i]['crew'][j]['remarks'],  crewPlanningData[i]['crew'][j]['employeeNo'], crewPlanningData[i]['crew'][j]['joiningDate'], crewPlanningData[i]['crew'][j]['monthsAsOf31Jul2021']]);
                    }
                }
            }
            return [];
        } else {
            return null
        }
    }
    async UpdateSpareData(spareData) {
        if (spareData instanceof Array && spareData.length > 0) {
            for(let i=0; i<spareData.length; i++){
                if(spareData[i].spareCrewId){
                    await this.sqlInterface.PerformQueryPromise(`
                    UPDATE ${config.kstConfig.sqlTables.SPARECREW} SET location=$2, shift=$3, ops=$4, nationality=$5, rank=$6, name=$7, remarks=$8, employee_no=$9, joining_date=$10, months_as_of_31jul2021=$11  WHERE spare_crew_id = $1
                    `, [spareData[i]['spareCrewId'], spareData[i]['location'], spareData[i]['shift'], spareData[i]['ops'], spareData[i]['nationality'], spareData[i]['rank'], spareData[i]['name'], spareData[i]['remarks'], spareData[i]['employeeNo'], spareData[i]['joiningDate'], spareData[i]['monthsAsOf31Jul2021']]);
                }
                else{
                    await this.sqlInterface.PerformQueryPromise(`
                    INSERT INTO ${config.kstConfig.sqlTables.SPARECREW} (location, shift, ops, nationality, rank, name, remarks, employee_no, joining_date, months_as_of_31jul2021)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                    `, [spareData[i]['location'], spareData[i]['shift'], spareData[i]['ops'], spareData[i]['nationality'], spareData[i]['rank'], spareData[i]['name'], spareData[i]['remarks'], spareData[i]['employeeNo'], spareData[i]['joiningDate'], spareData[i]['monthsAsOf31Jul2021']]);
                }
            }
            return [];
        } else {
            return null
        }
    }
    async GetSpareCrewData() {
        let spareCrewData = [];
        let spareCrew = await this.sqlInterface.PerformQueryPromise(`
            SELECT spare_crew_id, location, shift, ops, nationality, rank, name, remarks, employee_no, joining_date, months_as_of_31jul2021  
            FROM ${config.kstConfig.sqlTables.SPARECREW} ORDER BY spare_crew_id
        `,[]);
        if (spareCrew instanceof Array && spareCrew.length > 0) {
            for(let i=0; i<spareCrew.length; i++){
                spareCrewData.push({
                    spareCrewId : spareCrew[i].spare_crew_id,
                    location : spareCrew[i].location,
                    shift : spareCrew[i].shift,
                    ops : spareCrew[i].ops,
                    nationality : spareCrew[i].nationality,
                    rank : spareCrew[i].rank,
                    name : spareCrew[i].name,
                    remarks : spareCrew[i].remarks,
                    employeeNo: spareCrew[i].employee_no,
                    joiningDate: spareCrew[i].joining_date,
                    monthsAsOf31Jul2021: parseInt(spareCrew[i].months_as_of_31jul2021)
                })
            }
            return spareCrewData;
        } else {
            return null
        }
    }
}
module.exports = {
    service : new CrewPlanningService()
};