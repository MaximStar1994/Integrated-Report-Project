const assert = require('assert');
const {interfaceObj} = require("../services/interfaces/PostGreSQLInterface")
const {identifiers} = require("../services/VesselReportService")
const config = require('../config/config')
var kstDBConfig = JSON.parse(JSON.stringify(config.kstConfig.testdbConfig))
const api = require('../api')
const Pretest = (done) => {
    interfaceObj.ChangeDB(kstDBConfig, async () => {
        try {
            await interfaceObj.ClearDB(config.kstConfig)
            done()
        } catch (err) {
            console.log(err)
            assert.fail("failed to clear db")
        }
    })
}
const CreateSuperAdmin = async () => {
    let superadminuser = await api.SignUp("superadmin","superadmin", null)
    await api.SetSuperAdmin(superadminuser.accountId)
    return superadminuser
}
const CreateAdminUser = async(username, vesselId) => {
    let account =  await api.SignUp(username, username, vesselId)
    await api.SetAdmin(account.accountId)
    return await api.Login(username, username)
}
const vessels = [
    {vesselId : 1, name : 'KST1', timezone : 'Asia/Singapore'},
    {vesselId : 2, name : 'KST2', timezone : 'Asia/Singapore'},
    {vesselId : 3, name : 'KST3', timezone : 'Asia/Singapore'},
    {vesselId : 4, name : 'KST4', timezone : 'Asia/Singapore'},
]
const crew = [
    {vesselId : 1, name : 'Operator Tan', crewId : 2, shift: 1},
    {vesselId : 1, name : 'Operator Ng', crewId : 3, shift: 1},
    {vesselId : 1, name : 'Operator Kim', crewId : 4, shift: 1},
    {vesselId : 1, name : 'Operator Lim', crewId : 5, shift: 2},
    {vesselId : 1, name : 'Operator Rodrigrez', crewId : 6, shift: 2},
    {vesselId : 1, name : 'Operator Kiat', crewId : 13, shift: 2},
    {vesselId : 2, name : 'Operator Chim', crewId : 7, shift: 1},
    {vesselId : 2, name : 'Operator Lee', crewId : 8, shift: 1},
    {vesselId : 2, name : 'Operator Heng', crewId : 9, shift: 1},
    {vesselId : 2, name : 'Operator Lian', crewId : 10, shift: 2},
    {vesselId : 2, name : 'Operator Chee', crewId : 11, shift: 2},
    {vesselId : 2, name : 'Operator Sim', crewId : 12, shift: 2},
]
const templates = {
    vesselBreakdownEvent : {
        vesselId : 1,
        breakdownDatetime : new Date(),
        backToOperationDatetime : null, 
        reason : "spoilt",  
    },
    vesselBreakdownEventSupport : {
        eventId : 1,
        superintendent : "Lim Sup", 
        category : "Others", 
        remarks : "No spoil", 
        tugReplacement : "no replacement", 
        tugCondition : "operational", 
    },
    tugDisinfection : {
        vesselId : 1,
        dateSubmitted : new Date(),
        timeSubmitted : "0530",
        filepath : null,
        gallery : true,
        wheelhouse : true,
        messroom : true,
        toilets : true,
        doorknobs : true,
        staircase : true,
        silentroom : true,
        remarks : "Great Disinfection",
        checkedBy : "Master",
    },
    vesselreportform : {
        shift : 1,
        vesselId : 1,
        filepath : null,
        formDate : new Date(2021,1,1,0,0,0,0),
        remark : "this is awesome",
        decklogs : [{
            startLocation : 'Singapore',
            endLocation : 'Malaysia',
            starttime : new Date(2021,1,1,8,0,0,0),
            endtime : new Date(2021,1,1,10,0,0,0),
            status : 'Proceed',
            typeOfJob : 'Berthing',
            tugPosition : 'Bow',
            noOfTugs : 4,
            order : 1
        },{
            startLocation : 'Woodlands',
            endLocation : 'Tuas',
            starttime : new Date(2021,1,1,6,0,0,0),
            endtime : new Date(2021,1,1,7,0,0,0),
            status : 'Standby',
            typeOfJob : 'Shifting',
            tugPosition : 'S/B',
            noOfTugs : 2,
            order : 0
        }],
        crew : [{
            crewId : 2,
            isWorking : true,
            shift: 1
        },{
            crewId : 3,
            isWorking : true,
            shift: 1
        },{
            crewId : 4,
            isWorking : true,
            shift: 1
        },{
            crewId : 5,
            isWorking : false,
            shift: 2
        },{
            crewId : 6,
            isWorking : false,
            shift: 2
        },{
            crewId : 13,
            isWorking : false,
            shift: 2
        }],
        engines : [
            {
                engineIdentifier : identifiers.ENGINEIDENTIFIERS.PMainEngine,
                carryForwardRunningHour: 5.0,
                runningHour : 1.0,
                totalRunningHour: 6.0,
                rpm : 1.1,
                propellerRpm : 1.2,
                cppPitch : 1.3,
                fuelrack : "1.4",
                lubOilPressure : 1.5,
                freshwaterPressure : 1.6,
                seawaterPressure : 1.7,
                chargeAirPressure : 1.8,
                turboChargerLubOilPressure : 1.9, 
                fuelOilPressure : 1.11,
                lubOilTempBfCooler : 1.12,
                lubOilTempAfCooler : 1.13,
                freshwaterTempIn : 1.14, 
                freshwaterTempOut : 1.15,
                seawaterTempIn : 1.16,
                seawaterTempOut : 1.17,
                turboChargerRpm : 1.18, 
                turboChargerExhaustTempIn : 1.19, 
                turboChargerExhaustTempOut : 1.20, 
                chargeAirTemp : 1.21, 
                cylinder1PeakPressure : 1.22,
                cylinder1ExhaustTemp : 1.23,
                cylinder2PeakPressure : 1.24,
                cylinder2ExhaustTemp : 1.25,
                cylinder3PeakPressure : 1.26,
                cylinder3ExhaustTemp : 1.27,
                cylinder4PeakPressure : 1.28,
                cylinder4ExhaustTemp : 1.29,
                cylinder5PeakPressure : 1.30,
                cylinder5ExhaustTemp : 1.31,
                cylinder6PeakPressure : 1.32,
                cylinder6ExhaustTemp : 1.33,
                cylinder7PeakPressure : 1.34,
                cylinder7ExhaustTemp : 1.35,
                cylinder8PeakPressure : 1.36,
                cylinder8ExhaustTemp : 1.37,
                remarks: 'remarks!'
            },{
                engineIdentifier : identifiers.ENGINEIDENTIFIERS.SMainEngine,
                carryForwardRunningHour: 6.0,
                runningHour : 7.0,
                totalRunningHour: 13.0,
                rpm : 2.1,
                propellerRpm : 2.2,
                cppPitch : 2.3,
                fuelrack : "2.4",
                lubOilPressure : 2.5,
                freshwaterPressure : 2.6,
                seawaterPressure : 2.7,
                chargeAirPressure : 2.8,
                turboChargerLubOilPressure : 2.9, 
                fuelOilPressure : 2.11,
                lubOilTempBfCooler : 2.12,
                lubOilTempAfCooler : 2.13,
                freshwaterTempIn : 2.14, 
                freshwaterTempOut : 2.15,
                seawaterTempIn : 2.16,
                seawaterTempOut : 2.17,
                turboChargerRpm : 2.18, 
                turboChargerExhaustTempIn : 2.19, 
                turboChargerExhaustTempOut : 2.20, 
                chargeAirTemp : 2.21, 
                cylinder1PeakPressure : 2.22,
                cylinder1ExhaustTemp : 2.23,
                cylinder2PeakPressure : 2.24,
                cylinder2ExhaustTemp : 2.25,
                cylinder3PeakPressure : 2.26,
                cylinder3ExhaustTemp : 2.27,
                cylinder4PeakPressure : 2.28,
                cylinder4ExhaustTemp : 2.29,
                cylinder5PeakPressure : 2.30,
                cylinder5ExhaustTemp : 2.31,
                cylinder6PeakPressure : 2.32,
                cylinder6ExhaustTemp : 2.33,
                cylinder7PeakPressure : 2.34,
                cylinder7ExhaustTemp : 2.35,
                cylinder8PeakPressure : 2.36,
                cylinder8ExhaustTemp : 2.37,
                remarks: 'remarks2!'
            }
        ],
        generators : [{
            carryForwardRunningHour: 6.0,
            runningHour : 7.0,
            totalRunningHour: 13.0,
            voltage : 400,
            frequency : 401, 
            current : 402, 
            power : 403,
            foPressue : 1.1,
            loPressure : 1.2, 
            loTemp : 1.3, 
            loLevel : "1.4", 
            coolingWaterTempIn : 1.5, 
            coolingWaterTempOut : 1.6, 
            exhaustTemp : 1.7,
            remarks: 'generatorRemarks!',
            generatorIdentifier : identifiers.GENERATORIDENTIFIERS.AE1,
        },{
            carryForwardRunningHour: 2.0,
            runningHour : 3.0,
            totalRunningHour: 5.0,
            voltage : 500,
            frequency : 501, 
            current : 502, 
            power : 503,
            foPressue : 2.1,
            loPressure : 2.2, 
            loTemp : 2.3, 
            loLevel : "2.4", 
            coolingWaterTempIn : 2.5, 
            coolingWaterTempOut : 2.6, 
            exhaustTemp : 2.7,
            remarks: 'generatorRemarks2!',
            generatorIdentifier : identifiers.GENERATORIDENTIFIERS.AE2,
        }],
        zpClutch : [{
            identifier : identifiers.ZPCLUTCHIDENTIFIERS.SZPCLutch,
            zpLoLevel : "high",
            zpLoPressure : 1,
            zpChargeOilPressure : 2,
            zpLoTemp : 3,
            zpHoLevel : "high",
            zpHoTempIn : 4,
            zpHoTempOut : 5,
            clutchOilPressure : 6,
            remarks: 'zpclutchremarks'
        },{
            identifier : identifiers.ZPCLUTCHIDENTIFIERS.PZPCLutch,
            zpLoLevel : "high",
            zpLoPressure : 1.1,
            zpChargeOilPressure : 2.1,
            zpLoTemp : 3.1,
            zpHoLevel : "high",
            zpHoTempIn : 4.1,
            zpHoTempOut : 5.1,
            clutchOilPressure : 6.1,
            remarks: 'zpclutchremarks2'
        }],
        aircons : [{
            identifier : identifiers.ACIDENTIFIER.AC1,
            compressorCurrent : 100,
            compressorSuctionPressure : 101, 
            compressorDischargePressure : 102, 
            loPressure : 103, 
            coolingWaterPressure : 104,
        }],
        rob : [{
            identifier : identifiers.ROBIDENTIFERS.GRADE40,
            carryForwardROB: 100,
            received : 100,
            consumed :  101,
            rob :  102
        },{
            identifier : identifiers.ROBIDENTIFERS.GRADE46,
            carryForwardROB: 200,
            received : 200,
            consumed :  201,
            rob :  202
        },{
            identifier : identifiers.ROBIDENTIFERS.GRADE68,
            carryForwardROB: 300,
            received : 300,
            consumed :  301,
            rob :  302
        },{
            identifier : identifiers.ROBIDENTIFERS.GRADE100,
            carryForwardROB: 400,
            received : 400,
            consumed :  401,
            rob :  402
        },{
            identifier : identifiers.ROBIDENTIFERS.GRADEP100,
            carryForwardROB: 500,
            received : 500,
            consumed :  501,
            rob :  502
        }],
        tanksoundings : [{
            identifier : identifiers.TANKSOUNDINGIDENTIFIERS.FODAY1,
            level : 100,
            volume :  101,
        },{
            identifier : identifiers.TANKSOUNDINGIDENTIFIERS.FODAY2,
            level : 200,
            volume :  201,
        },{
            identifier : identifiers.TANKSOUNDINGIDENTIFIERS.FO1,
            level : 300,
            volume : 301,
        },{
            identifier : identifiers.TANKSOUNDINGIDENTIFIERS.FO2,
            level : 400,
            volume : 401,
        },{
            identifier : identifiers.TANKSOUNDINGIDENTIFIERS.FO3,
            level : 500,
            volume : 501,
        },{
            identifier : identifiers.TANKSOUNDINGIDENTIFIERS.FO4,
            level : 600,
            volume : 601,
        },{
            identifier : identifiers.TANKSOUNDINGIDENTIFIERS.FO5,
            level : 700,
            volume : 701,
        },{
            identifier : identifiers.TANKSOUNDINGIDENTIFIERS.FO6,
            level : 800,
            volume : 801,
        },{
            identifier : identifiers.TANKSOUNDINGIDENTIFIERS.FW1,
            level : 900,
            volume : 901,
        },{
            identifier : identifiers.TANKSOUNDINGIDENTIFIERS.FW2,
            level : 1000,
            volume : 1001,
        },{
            identifier : identifiers.TANKSOUNDINGIDENTIFIERS.LO,
            level : 1100,
            volume : 1101,
        },{
            identifier : identifiers.TANKSOUNDINGIDENTIFIERS.HYDRAULIC,
            level : 1200,
            volume : 1201,
        },{
            identifier : identifiers.TANKSOUNDINGIDENTIFIERS.SEWAGE,
            level : 1300,
            volume : 1301,
        },{
            identifier : identifiers.TANKSOUNDINGIDENTIFIERS.GRAYWATER,
            level : 1400,
            volume : 1401,
        },{
            identifier : identifiers.TANKSOUNDINGIDENTIFIERS.WASTEROIL,
            level : 1500,
            volume : 1501,
        },{
            identifier : identifiers.TANKSOUNDINGIDENTIFIERS.OILYWATER,
            level : 1600,
            volume : 1601,
        },{
            identifier : identifiers.TANKSOUNDINGIDENTIFIERS.SLUDGE,
            level : 1700,
            volume : 1701,
        },{
            identifier : identifiers.TANKSOUNDINGIDENTIFIERS.DISPERSANT,
            level : 1800,
            volume : 1801,
        },{
            identifier : identifiers.TANKSOUNDINGIDENTIFIERS.FOAM,
            level : 1900,
            volume : 1901,
        },{
            identifier : identifiers.TANKSOUNDINGIDENTIFIERS.BALLAST1,
            level : 2000,
            volume : 2001,
        },{
            identifier : identifiers.TANKSOUNDINGIDENTIFIERS.BALLAST2,
            level : 2100,
            volume : 2101,
        },{
            identifier : identifiers.TANKSOUNDINGIDENTIFIERS.BALLAST3,
            level : 2200,
            volume : 2201,
        },{
            identifier : identifiers.TANKSOUNDINGIDENTIFIERS.BALLAST4,
            level : 2300,
            volume : 2301,
        }]
    },
    temperaturelog : {
        dateSubmitted : new Date(),
        crewId : crew[0].crewId,
        temperature : 36.5, 
        daySlot : 1,
    }
}
module.exports = {
    Pretest,
    CreateSuperAdmin,
    CreateAdminUser,
    vessels,
    crew,
    templates
}