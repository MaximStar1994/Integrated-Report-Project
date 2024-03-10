import React from 'react';

export const MORNINGIDENTIFIER = 1;
export const EVENINGIDENTIFIER = 2;

export const VESSELREPORTTABLEIDENTIFIER = '/vesselreport';
export const VESSELREPORTEDITFORMIDENTIFIER = '/vesselreporteditform/';
export const DAILYLOGEDITFORMIDENTIFIER = '/dailylogeditform';

const ROBIDENTIFERS = {
    GRADE40 : "GRADE40",
    GRADE46 : "GRADE46",
    GRADE68 : "GRADE68",
    GRADE100 : "GRADE100",
    GRADEP100 : "GRADEP100",
    FUELOIL : "FUELOIL",
    FRESHWATER : "FRESHWATER"
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
const ENGINEIDENTIFIERS = {
    SMainEngine : "S",
    PMainEngine : "P",
}
const GENERATORIDENTIFIERS = {
    AE1 : "AE1",
    AE2 : "AE2",
    AE3 : "AE3",
}
const ACIDENTIFIER = {
    AC1 : "AC1",
}
const ZPCLUTCHIDENTIFIERS = {
    SZPCLUTCH : "S",
    PZPCLUTCH : "P",
}

const identifiers = {
    ZPCLUTCHIDENTIFIERS,
    ENGINEIDENTIFIERS,
    GENERATORIDENTIFIERS,
    ACIDENTIFIER,
    ROBIDENTIFERS,
    TANKSOUNDINGIDENTIFIERS
}

export const statusSelections = {
    '': {text: 'Select Status', enableOthers: false},
    'Proceed (Free Running)': {text: 'Proceed (Free Running)', enableOthers: false},
    'Standby': {text: 'Standby', enableOthers: false},
    'Operation (On the Job)': {text: 'Operation (On the Job)', enableOthers: true},
}

const tugPositionSelections = {
    '': {text: 'Select Tug Position', enableOthers: false},
    'Bow': {text: 'Bow', enableOthers: false},
    'S/B': {text: 'S/B', enableOthers: false},
    'S/M': {text: 'S/M', enableOthers: false},
    'S/Q': {text: 'S/Q', enableOthers: false},
    'P/B': {text: 'P/B', enableOthers: false},
    'P/M': {text: 'P/M', enableOthers: false},
    'P/Q': {text: 'P/Q', enableOthers: false},
    'Stern': {text: 'Stern', enableOthers: false},
    'N.A.': {text: 'N.A.', enableOthers: false},
}

const typeOfJobSelections = {
    '': {text: 'Select Type of Job', enableOthers: false},
    'Berthing': {text: 'Berthing', enableOthers: false},
    'Unberthing': {text: 'Unberthing', enableOthers: false},
    'Shifting': {text: 'Shifting', enableOthers: false},
    'Standby': {text: 'Standby', enableOthers: false},
    'Proceed (Free Running)': {text: 'Proceed (Free Running)', enableOthers: false},
}

export const DeckLogStructure = {
    startLocation : {title: 'Location From', type: 'text'},
    endLocation : {title: 'Location To', type: 'text'},
    starttime : {title: 'Start Time', type: 'datetime'},
    endtime : {title: 'End Time', type: 'datetime'},
    status : {title: 'Status', type: 'selection', othersAllowed: true, options: statusSelections, other: 'otherStatus'},
    typeOfJob : {title: 'Type of Job', type: 'selection', othersAllowed: false, options: typeOfJobSelections},
    tugPosition : {title: 'Tug Position', type: 'selection', othersAllowed: false, options: tugPositionSelections},
    noOfTugs : {title: 'No. of Tugs', type: 'number'},
}

export const MainEngine11Structure = {
    carryForwardRunningHour : {title: 'Main Engine Running Hour Carry Forward', type: 'number', suffix: 'Hr'},
    runningHour : {title: 'Main Engine Running Hour Daily Hour', type: 'number', suffix: 'Hr'},
    totalRunningHour : {title: 'Main Engine Running Hour Total', type: 'number', suffix: 'Hr', editable: false},
}

export const MainEngine11LNGStructure = {
    carryForwardRunningHour : {title: 'Main Engine FO Running Hour Carry Forward', type: 'number', suffix: 'Hr'},
    runningHour : {title: 'Main Engine FO Running Hour Daily Hour', type: 'number', suffix: 'Hr'},
    totalRunningHour : {title: 'Main Engine FO Running Hour Total', type: 'number', suffix: 'Hr', editable: false},
    LNGcarryForwardRunningHour : {title: 'Main Engine LNG Running Hour Carry Forward', type: 'number', suffix: 'Hr', LNGProperty: true},
    LNGrunningHour : {title: 'Main Engine LNG Running Hour Daily Hour', type: 'number', suffix: 'Hr', LNGProperty: true},
    totalLNGRunningHour : {title: 'Main Engine LNG Running Hour Total', type: 'number', suffix: 'Hr', editable: false, LNGProperty: true},
}

export const MainEngine12Structure = {
    chargeAirPressure : {title: 'Main Engine Charge Air Press', type: 'number', suffix: <span>BAR</span>, min: 0.2, max: 2.3},
    chargeAirTemp : {title: 'Main Engine Charge Air Temp', type: 'number', suffix: <span>&#176;C</span>, min: 25, max: 45},
    turboChargerRpm : {title: 'Main Engine Turbocharger RPM', type: 'number', suffix: <span>RPM</span>, min: 0, max: 34230},
    turboChargerExhaustTempIn : {title: 'Main Engine Turbocharger Exhaust Temp (In)', type: 'number', suffix: <span>&#176;C</span>, min: 365, max: 450},
    turboChargerExhaustTempOut : {title: 'Main Engine Turbocharger Exhaust Temp (Out)', type: 'number', suffix: <span>&#176;C</span>, min: 220, max: 400},
    turboChargerLubOilPressure : {title: 'Main Engine Turbocharger Lub. Oil Press', type: 'number', suffix: <span>BAR</span>, min: 0.2, max: 2.8},
}

export const MainEngine13Structure = {
    remarks : {title: 'Main Engine Remarks (Optional)', type: 'textarea'}
}

export const MainEngine21Structure = {
    rpm : {title: 'Main Engine RPM', type: 'number', suffix: <span>RPM</span>, min: 400, max: 750},
    propellerRpm : {title: 'Main Engine Propeller RPM', type: 'number', suffix: <span>RPM</span>, min: 0, max: 220},
    cppPitch : {title: 'Main Engine CPP Pitch, if applicable', type: 'number', suffix: <span>&#176;</span>, min: -20, max: 30},
    fuelrack : {title: 'Main Engine Fuel Rack / Level', type: 'number', min: 1, max: 7},
    lubOilPressure : {title: 'Main Engine Lub. Oil Press', type: 'number', suffix: <span>BAR</span>, min: 3.5, max: 5.6},
    fuelOilPressure : {title: 'Main Engine Fuel Oil Press', type: 'number', suffix: <span>BAR</span>, min: 0.5, max: 1.5},
    lubOilTempBfCooler : {title: 'Main Engine LO Temp Before Cooler', type: 'number', suffix: <span>&#176;C</span>, min: 63, max: 73},
    lubOilTempAfCooler : {title: 'Main Engine LO Temp After Cooler', type: 'number', suffix: <span>&#176;C</span>, min: 51, max: 60},
}

export const MainEngine31Structure = {
    cylinder1PeakPressure : {title: 'Main Engine Combustion Peak Pressure (Cylinder #1)', type: 'number', suffix: <span>BAR</span>, min: 0, max: 146},
    cylinder2PeakPressure : {title: 'Main Engine Combustion Peak Pressure (Cylinder #2)', type: 'number', suffix: <span>BAR</span>, min: 0, max: 146},
    cylinder3PeakPressure : {title: 'Main Engine Combustion Peak Pressure (Cylinder #3)', type: 'number', suffix: <span>BAR</span>, min: 0, max: 146},
    cylinder4PeakPressure : {title: 'Main Engine Combustion Peak Pressure (Cylinder #4)', type: 'number', suffix: <span>BAR</span>, min: 0, max: 146},
    cylinder5PeakPressure : {title: 'Main Engine Combustion Peak Pressure (Cylinder #5)', type: 'number', suffix: <span>BAR</span>, min: 0, max: 146},
    cylinder6PeakPressure : {title: 'Main Engine Combustion Peak Pressure (Cylinder #6)', type: 'number', suffix: <span>BAR</span>, min: 0, max: 146},
    cylinder7PeakPressure : {title: 'Main Engine Combustion Peak Pressure (Cylinder #7)', type: 'number', suffix: <span>BAR</span>, min: 0, max: 146},
    cylinder8PeakPressure : {title: 'Main Engine Combustion Peak Pressure (Cylinder #8)', type: 'number', suffix: <span>BAR</span>, min: 0, max: 146},
}

export const MainEngine32Structure = {
    freshwaterPressure : {title: 'Main Engine F.W. Cooling Press', type: 'number', suffix: <span>BAR</span>, min: 2.8, max: 3.6},
    freshwaterTempIn : {title: 'Main Engine Cooling Fresh Water Temp In', type: 'number', suffix: <span>&#176;C</span>, min: 58, max: 68},
    freshwaterTempOut : {title: 'Main Engine Cooling Fresh Water Temp Out', type: 'number', suffix: <span>&#176;C</span>, min: 68, max: 72},
}

export const MainEngine41Structure = {
    cylinder1ExhaustTemp : {title: 'Main Engine Exhaust Temp (Cylinder 1)', type: 'number', suffix: <span>&#176;C</span>, min: 220, max: 450},
    cylinder2ExhaustTemp : {title: 'Main Engine Exhaust Temp (Cylinder 2)', type: 'number', suffix: <span>&#176;C</span>, min: 220, max: 450},
    cylinder3ExhaustTemp : {title: 'Main Engine Exhaust Temp (Cylinder 3)', type: 'number', suffix: <span>&#176;C</span>, min: 220, max: 450},
    cylinder4ExhaustTemp : {title: 'Main Engine Exhaust Temp (Cylinder 4)', type: 'number', suffix: <span>&#176;C</span>, min: 220, max: 450},
    cylinder5ExhaustTemp : {title: 'Main Engine Exhaust Temp (Cylinder 5)', type: 'number', suffix: <span>&#176;C</span>, min: 220, max: 450},
    cylinder6ExhaustTemp : {title: 'Main Engine Exhaust Temp (Cylinder 6)', type: 'number', suffix: <span>&#176;C</span>, min: 220, max: 450},
    cylinder7ExhaustTemp : {title: 'Main Engine Exhaust Temp (Cylinder 7)', type: 'number', suffix: <span>&#176;C</span>, min: 220, max: 450},
    cylinder8ExhaustTemp : {title: 'Main Engine Exhaust Temp (Cylinder 8)', type: 'number', suffix: <span>&#176;C</span>, min: 220, max: 450},
}

export const MainEngine42Structure = {
    seawaterPressure : {title: 'Main Engine S.W. Cooling Press', type: 'number', suffix: <span>BAR</span>, min: 0.3, max: 2},
    seawaterTempIn : {title: 'Main Engine Cooling Sea Water Temp In', type: 'number', suffix: <span>&#176;C</span>, min: 18, max: 35},
    seawaterTempOut : {title: 'Main Engine Cooling Sea Water Temp Out', type: 'number', suffix: <span>&#176;C</span>, min: 35, max: 45},
}

export const AE11Structure = {
    carryForwardRunningHour : {title: 'Running Hour Carry Forward', type: 'number', suffix: <span>HR</span>},
    runningHour : {title: 'Running Hour Daily Hour', type: 'number', suffix: <span>HR</span>},
    totalRunningHour : {title: 'Running Hour Total', type: 'number', suffix: <span>HR</span>, editable: false},
}

export const AE12Structure = {
    voltage : {title: 'Voltage', type: 'number', suffix: <span>V</span>, min: 380, max: 440},
    frequency : {title: 'Frequency', type: 'number', suffix: <span>Hz</span>, min: 50, max: 60},
    current : {title: 'Current', type: 'number', suffix: <span>A</span>},
    power : {title: 'Power', type: 'number', suffix: <span>kW</span>},
}

export const AE13Structure = {
    remarks : {title: 'Remarks (Optional)', type: 'textarea'},
}

const aeLoLevelSelection = {
    '': {text: 'Select LO Level', enableOthers: false},
    'Low': {text: 'Low', enableOthers: false},
    'High': {text: 'High', enableOthers: false},
}

export const AE21Structure = {
    foPressue : {title: 'FO Press', type: 'number', suffix: <span>BAR</span>, min: 0.5, max: 2.5},
    loPressure : {title: 'LO Press', type: 'number', suffix: <span>BAR</span>, min: 1, max: 4.5}, 
    loTemp : {title: 'LO Temp', type: 'number', suffix: <span>&#176;C</span>, min: 45, max: 121}, 
    loLevel : {title: 'LO Level', type: 'selection', options: aeLoLevelSelection}, 
    coolingWaterTempIn : {title: 'Cooling Water Temp In', type: 'number', suffix: <span>&#176;C</span>, min: 35, max: 65}, 
    coolingWaterTempOut : {title: 'Cooling Water Temp Out', type: 'number', suffix: <span>&#176;C</span>, min: 65, max: 100}, 
    exhaustTemp : {title: 'Exhaust Temp (Before Turbocharger)', type: 'number', suffix: <span>&#176;C</span>, min: 200, max: 521},
}

const zpHoLevelSelection = {
    '': {text: 'Select Hydraulic Oil Level', enableOthers: false},
    'Low': {text: 'Low', enableOthers: false},
    'High': {text: 'High', enableOthers: false},
}

const zpLoLevelSelection = {
    '': {text: 'Select ZP LO Level', enableOthers: false},
    'Low': {text: 'Low', enableOthers: false},
    'High': {text: 'High', enableOthers: false},
}

export const AzimuthThrusterStructure = {
    zpLoLevel : {title: 'ZP LO Level (ISO VG100)', type: 'selection', othersAllowed: false, options: zpLoLevelSelection},
    zpLoPressure : {title: 'ZP LO Press', type: 'number', suffix: <span>BAR</span>, min: 0.8, max: 2.7},
    zpChargeOilPressure : {title: 'ZP Charge Oil Press', type: 'number', suffix: <span>BAR</span>, min: 8, max: 24.5},
    zpLoTemp : {title: 'ZP LO Temp', type: 'number', suffix: <span>&#176;C</span>, min: 29, max: 70},
    zpHoLevel : {title: 'ZP Hydraulic Oil Level (ISO VG46 or 68)', type: 'selection', othersAllowed: false, options: zpHoLevelSelection},
    zpHoTempIn : {title: 'ZP Hydraulic Oil at Cooler (In)', type: 'number', suffix: <span>&#176;C</span>, min: 26, max: 65},
    zpHoTempOut : {title: 'ZP Hydraulic Oil at Cooler (Out)', type: 'number', suffix: <span>&#176;C</span>, min: 23, max: 60},
    clutchOilPressure : {title: 'Clutch Oil Press', type: 'number', suffix: <span>BAR</span>, min: 11, max: 22.5},
    zpRemarks : {title: 'ZP Remarks (Optional)', type: 'textarea'},
}

export const AirConditioningStructure = {
    compressorCurrent : {title: 'Compressor Amp', type: 'number', suffix: 'A'},
    compressorSuctionPressure : {title: 'Compressor Suction Press', type: 'number', suffix: 'BAR'}, 
    compressorDischargePressure : {title: 'Compressor Discharge Press', type: 'number', suffix: 'BAR'}, 
    loPressure : {title: 'LO Press', type: 'number', suffix: 'BAR'}, 
    coolingWaterPressure : {title: 'Cooling Water Press', type: 'number', suffix: 'BAR'},
    remarks : {title: 'Remarks (Optional)', type: 'textarea'}
}

export const ROBStructure = {
    carryForward: {title: 'Carry Forward ROB', type: 'number', suffix: ['kg', 'l']},
    received : {title: 'Received', type: 'number', suffix: ['kg', 'l']},
    consumed : {title: 'Consumed', type: 'number', suffix: ['kg', 'l']},
    rob : {title: 'ROB', type: 'number', suffix: ['kg', 'l'], editable: false},
}

export const TankSoundingsStructure = {
    level : {type: 'number', suffix: 'm', max: 'maxdepth'},
    volume :  {type: 'number', suffix: <span>m<sup>3</sup></span>, max: 'maxvolume'},
}

export const ActivitiesStructure = {
    remark : {title: 'Activities / Remarks (Optional)', type: 'textarea'}
}

//Templates
export const deckLogTemplate = {
    startLocation : '',
    endLocation : '',
    starttime : null,
    endtime : null,
    status : '',
    typeOfJob : '',
    tugPosition : '',
    noOfTugs : null,
    order : null,
    otherStatus: ''
}

export const crewTemplate = {
    crewId : null,
    name : null
}

export const engineTemplate = {
    engineIdentifier : '',
    carryForwardRunningHour : null,
    runningHour : null,
    LNGcarryForwardRunningHour : null,
    LNGrunningHour : null,
    totalRunningHour : null
}

export const generatorsTemplate = {
    carryForwardRunningHour : null,
    runningHour : null,
    totalRunningHour : null,
    voltage : null,
    frequency : null, 
    current : null, 
    power : null,
    foPressue : null,
    loPressure : null, 
    loTemp : null, 
    loLevel : "", 
    coolingWaterTempIn : null, 
    coolingWaterTempOut : null, 
    exhaustTemp : null,
    remarks: "",
    generatorIdentifier : '',
}

export const zpClutchTemplate = {
    identifier : '',
    zpLoLevel : "",
    zpLoPressure : null,
    zpChargeOilPressure : null,
    zpLoTemp : null,
    zpHoLevel : "",
    zpHoTempIn : null,
    zpHoTempOut : null,
    clutchOilPressure : null,
    zpRemarks: ""
}

export const AirConditioningTemplate = {
    identifier : '',
    compressorCurrent : null,
    compressorSuctionPressure : null, 
    compressorDischargePressure : null, 
    loPressure : null, 
    coolingWaterPressure : null,
}

export const robTemplate = {
    identifier : '',
    carryForward: null,
    received : null,
    consumed : null,
    rob : null
}

export const tankSoundingsTemplate = {
    identifier : '',
    level : null,
    volume :  null,
}

export const vesselReportTemplate = {
    shift : null,
    vesselId : null,
    filepath : null,
    chiefEngineerSignature: null,
    chiefEngineerName: '',
    captainSignature: null,
    captainName: '',
    remark : "",
    // decklogs : [{
    //     ...deckLogTemplate,
    //     order: 0
    // }],
    crew : {working: [], resting: []},
    engines : [
        {
            ...engineTemplate,
            engineIdentifier: identifiers.ENGINEIDENTIFIERS.SMainEngine
        },{
            ...engineTemplate,
            engineIdentifier: identifiers.ENGINEIDENTIFIERS.PMainEngine
        }
    ],
    generators : [],
    zpClutch : [{
        ...zpClutchTemplate,
        identifier : identifiers.ZPCLUTCHIDENTIFIERS.SZPCLUTCH,
    },{
        ...zpClutchTemplate,
        identifier : identifiers.ZPCLUTCHIDENTIFIERS.PZPCLUTCH,
    }],
    aircons : [{
        ...AirConditioningTemplate,
        identifier: identifiers.ACIDENTIFIER.AC1
    }],
    rob : [],
    tanksoundings : []
}

export const dailyLogTemplate = {
    vesselId : null,
    filepath : null,
    chiefEngineerSignature: null,
    chiefEngineerName: '',
    captainSignature: null,
    captainName: '',
    remark : "",
    engines : [
        {
            ...engineTemplate,
            engineIdentifier: identifiers.ENGINEIDENTIFIERS.SMainEngine
        },{
            ...engineTemplate,
            engineIdentifier: identifiers.ENGINEIDENTIFIERS.PMainEngine
        }
    ],
    generators : [],
    rob : [],
    tanksoundings : []
}


// const vesselreportform = {
//     shift : 1,
//     vesselId : 1,
//     filepath : null,
//     formDate : new Date(2021,1,1,0,0,0,0),
//     fuelOilConsumed : 200,
//     fuelOilRob : 100,
//     fwConsumed : 300,
//     fwRob : 400,
//     remark : "this is awesome",
//     decklogs : [{
//         startLocation : 'Singapore',
//         endLocation : 'Malaysia',
//         starttime : new Date(2021,1,1,8,0,0,0),
//         endtime : new Date(2021,1,1,10,0,0,0),
//         status : 'Proceed',
//         typeOfJob : 'Berthing',
//         tugPosition : 'Bow',
//         noOfTugs : 4,
//         order : 1
//     },{
//         startLocation : 'Woodlands',
//         endLocation : 'Tuas',
//         starttime : new Date(2021,1,1,6,0,0,0),
//         endtime : new Date(2021,1,1,7,0,0,0),
//         status : 'Standby',
//         typeOfJob : 'Shifting',
//         tugPosition : 'S/B',
//         noOfTugs : 2,
//         order : 0
//     }],
//     crew : [{
//         crewId : 2,
//         isWorking : true,
//     },{
//         crewId : 3,
//         isWorking : true,
//     },{
//         crewId : 4,
//         isWorking : true,
//     },{
//         crewId : 5,
//         isWorking : false,
//     },{
//         crewId : 6,
//         isWorking : false,
//     },{
//         crewId : 13,
//         isWorking : false,
//     }],
//     engines : [
//         {
//             engineIdentifier : identifiers.ENGINEIDENTIFIERS.PMainEngine,
//             runningHour : 1.0,
//             rpm : 1.1,
//             propellerRpm : 1.2,
//             cppPitch : 1.3,
//             fuelrack : "1.4",
//             lubOilPressure : 1.5,
//             freshwaterPressure : 1.6,
//             seawaterPressure : 1.7,
//             chargeAirPressure : 1.8,
//             turboChargerLubOilPressure : 1.9, 
//             fuelOilPressure : 1.11,
//             lubOilPressureBfCooler : 1.12, //
//             lubOilPressureAfCooler : 1.13, //
//             freshwaterTempIn : 1.14, 
//             freshwaterTempOut : 1.15,
//             seawaterTempIn : 1.16,
//             seawaterTempOut : 1.17,
//             turboChargerRpm : 1.18, 
//             turboChargerExhaustTempIn : 1.19, 
//             turboChargerExhaustTempOut : 1.20, 
//             chargeAirTemp : 1.21, 
//             cylinder1PeakPressure : 1.22,
//             cylinder1ExhaustTemp : 1.23,
//             cylinder2PeakPressure : 1.24,
//             cylinder2ExhaustTemp : 1.25,
//             cylinder3PeakPressure : 1.26,
//             cylinder3ExhaustTemp : 1.27,
//             cylinder4PeakPressure : 1.28,
//             cylinder4ExhaustTemp : 1.29,
//             cylinder5PeakPressure : 1.30,
//             cylinder5ExhaustTemp : 1.31,
//             cylinder6PeakPressure : 1.32,
//             cylinder6ExhaustTemp : 1.33,
//             cylinder7PeakPressure : 1.34,
//             cylinder7ExhaustTemp : 1.35,
//             cylinder8PeakPressure : 1.36,
//             cylinder8ExhaustTemp : 1.37,
//         },{
//             engineIdentifier : identifiers.ENGINEIDENTIFIERS.SMainEngine,
//             runningHour : 2.0,
//             rpm : 2.1,
//             propellerRpm : 2.2,
//             cppPitch : 2.3,
//             fuelrack : "2.4",
//             lubOilPressure : 2.5,
//             freshwaterPressure : 2.6,
//             seawaterPressure : 2.7,
//             chargeAirPressure : 2.8,
//             turboChargerLubOilPressure : 2.9, 
//             fuelOilPressure : 2.11,
//             lubOilPressureBfCooler : 2.12,
//             lubOilPressureAfCooler : 2.13,
//             freshwaterTempIn : 2.14, 
//             freshwaterTempOut : 2.15,
//             seawaterTempIn : 2.16,
//             seawaterTempOut : 2.17,
//             turboChargerRpm : 2.18, 
//             turboChargerExhaustTempIn : 2.19, 
//             turboChargerExhaustTempOut : 2.20, 
//             chargeAirTemp : 2.21, 
//             cylinder1PeakPressure : 2.22,
//             cylinder1ExhaustTemp : 2.23,
//             cylinder2PeakPressure : 2.24,
//             cylinder2ExhaustTemp : 2.25,
//             cylinder3PeakPressure : 2.26,
//             cylinder3ExhaustTemp : 2.27,
//             cylinder4PeakPressure : 2.28,
//             cylinder4ExhaustTemp : 2.29,
//             cylinder5PeakPressure : 2.30,
//             cylinder5ExhaustTemp : 2.31,
//             cylinder6PeakPressure : 2.32,
//             cylinder6ExhaustTemp : 2.33,
//             cylinder7PeakPressure : 2.34,
//             cylinder7ExhaustTemp : 2.35,
//             cylinder8PeakPressure : 2.36,
//             cylinder8ExhaustTemp : 2.37,
//         }
//     ],
//     runninghours: [{
//         total : 100,
//         carryForward : 90,
//         identifier : identifiers.RUNNINGHOURIDENTIFIERS.Gen1
//     },{
//         total : 200,
//         carryForward : 190,
//         identifier : identifiers.RUNNINGHOURIDENTIFIERS.Gen2
//     },{
//         total : 300,
//         carryForward : 290,
//         identifier : identifiers.RUNNINGHOURIDENTIFIERS.Gen3
//     },{
//         total : 400,
//         carryForward : 390,
//         identifier : identifiers.RUNNINGHOURIDENTIFIERS.PMainEngine
//     },{
//         total : 500,
//         carryForward : 490,
//         identifier : identifiers.RUNNINGHOURIDENTIFIERS.SMainEngine
//     }],
//     powerreadings : [{
//         identifier : identifiers.POWERREADINGIDENTIFIER.Gen1,
//         voltage : 100,
//         frequency : 101, 
//         current : 102, 
//         power : 103 
//     },{
//         identifier : identifiers.POWERREADINGIDENTIFIER.Gen2,
//         voltage : 200,
//         frequency : 201, 
//         current : 202, 
//         power : 203 
//     },{
//         identifier : identifiers.POWERREADINGIDENTIFIER.Gen3,
//         voltage : 300,
//         frequency : 301, 
//         current : 302, 
//         power : 303 
//     },{
//         identifier : identifiers.POWERREADINGIDENTIFIER.PMainEngine,
//         voltage : 400,
//         frequency : 401, 
//         current : 402, 
//         power : 403 
//     },{
//         identifier : identifiers.POWERREADINGIDENTIFIER.SMainEngine,
//         voltage : 500,
//         frequency : 501, 
//         current : 502, 
//         power : 503 
//     }],
//     generators : [{
//         foPressue : 1.1,
//         loPressure : 1.2, 
//         loTemp : 1.3, 
//         loLevel : "1.4", 
//         coolingWaterTempIn : 1.5, 
//         coolingWaterTempOut : 1.6, 
//         exhaustTemp : 1.7,
//         generatorIdentifier : identifiers.GENERATORIDENTIFIERS.Gen1,
//     },{
//         foPressue : 2.1,
//         loPressure : 2.2, 
//         loTemp : 2.3, 
//         loLevel : "2.4", 
//         coolingWaterTempIn : 2.5, 
//         coolingWaterTempOut : 2.6, 
//         exhaustTemp : 2.7,
//         generatorIdentifier : identifiers.GENERATORIDENTIFIERS.Gen2,
//     }],
//     zpClutch : [{
//         identifier : identifiers.ZPCLUTCHIDENTIFIERS.SZPCLutch,
//         zpLoLevel : "high",
//         zpLoPressure : 1,
//         zpChargeOilPressure : 2,
//         zpLoTemp : 3,
//         zpHoLevel : "high",
//         zpHoTempIn : 4,
//         zpHoTempOut : 5,
//         clutchOilPressure : 6,
//     },{
//         identifier : identifiers.ZPCLUTCHIDENTIFIERS.PZPCLutch,
//         zpLoLevel : "high",
//         zpLoPressure : 1.1,
//         zpChargeOilPressure : 2.1,
//         zpLoTemp : 3.1,
//         zpHoLevel : "high",
//         zpHoTempIn : 4.1,
//         zpHoTempOut : 5.1,
//         clutchOilPressure : 6.1,
//     }],
//     aircons : [{
//         identifier : identifiers.ACIDENTIFIER.AC1,
//         compressorCurrent : 100,
//         compressorSuctionPressure : 101, 
//         compressorDischargePressure : 102, 
//         loPressure : 103, 
//         coolingWaterPressure : 104,
//         coolingWaterTemp : 105,
//     }],
//     rob : [{
//         identifier : identifiers.ROBIDENTIFERS.GRADE40,
//         received : 100,
//         consumed :  101,
//         rob :  102
//     },{
//         identifier : identifiers.ROBIDENTIFERS.GRADE46,
//         received : 200,
//         consumed :  201,
//         rob :  202
//     },{
//         identifier : identifiers.ROBIDENTIFERS.GRADE68,
//         received : 300,
//         consumed :  301,
//         rob :  302
//     },{
//         identifier : identifiers.ROBIDENTIFERS.GRADE100,
//         received : 400,
//         consumed :  401,
//         rob :  402
//     },{
//         identifier : identifiers.ROBIDENTIFERS.GRADEP100,
//         received : 500,
//         consumed :  501,
//         rob :  502
//     }],
//     tanksoundings : [{
//         identifier : identifiers.TANKSOUNDINGIDENTIFIERS.FODAY1,
//         level : 100,
//         volume :  101,
//     },{
//         identifier : identifiers.TANKSOUNDINGIDENTIFIERS.FODAY2,
//         level : 200,
//         volume :  201,
//     },{
//         identifier : identifiers.TANKSOUNDINGIDENTIFIERS.FO1,
//         level : 300,
//         volume : 301,
//     },{
//         identifier : identifiers.TANKSOUNDINGIDENTIFIERS.FO2,
//         level : 400,
//         volume : 401,
//     },{
//         identifier : identifiers.TANKSOUNDINGIDENTIFIERS.FO3,
//         level : 500,
//         volume : 501,
//     },{
//         identifier : identifiers.TANKSOUNDINGIDENTIFIERS.FO4,
//         level : 600,
//         volume : 601,
//     },{
//         identifier : identifiers.TANKSOUNDINGIDENTIFIERS.FO5,
//         level : 700,
//         volume : 701,
//     },{
//         identifier : identifiers.TANKSOUNDINGIDENTIFIERS.FO6,
//         level : 800,
//         volume : 801,
//     },{
//         identifier : identifiers.TANKSOUNDINGIDENTIFIERS.FW1,
//         level : 900,
//         volume : 901,
//     },{
//         identifier : identifiers.TANKSOUNDINGIDENTIFIERS.FW2,
//         level : 1000,
//         volume : 1001,
//     },{
//         identifier : identifiers.TANKSOUNDINGIDENTIFIERS.LO,
//         level : 1100,
//         volume : 1101,
//     },{
//         identifier : identifiers.TANKSOUNDINGIDENTIFIERS.HYDRAULIC,
//         level : 1200,
//         volume : 1201,
//     },{
//         identifier : identifiers.TANKSOUNDINGIDENTIFIERS.SEWAGE,
//         level : 1300,
//         volume : 1301,
//     },{
//         identifier : identifiers.TANKSOUNDINGIDENTIFIERS.GRAYWATER,
//         level : 1400,
//         volume : 1401,
//     },{
//         identifier : identifiers.TANKSOUNDINGIDENTIFIERS.WASTEROIL,
//         level : 1500,
//         volume : 1501,
//     },{
//         identifier : identifiers.TANKSOUNDINGIDENTIFIERS.OILYWATER,
//         level : 1600,
//         volume : 1601,
//     },{
//         identifier : identifiers.TANKSOUNDINGIDENTIFIERS.SLUDGE,
//         level : 1700,
//         volume : 1701,
//     },{
//         identifier : identifiers.TANKSOUNDINGIDENTIFIERS.DISPERSANT,
//         level : 1800,
//         volume : 1801,
//     },{
//         identifier : identifiers.TANKSOUNDINGIDENTIFIERS.FOAM,
//         level : 1900,
//         volume : 1901,
//     },{
//         identifier : identifiers.TANKSOUNDINGIDENTIFIERS.BALLAST1,
//         level : 2000,
//         volume : 2001,
//     },{
//         identifier : identifiers.TANKSOUNDINGIDENTIFIERS.BALLAST2,
//         level : 2100,
//         volume : 2101,
//     },{
//         identifier : identifiers.TANKSOUNDINGIDENTIFIERS.BALLAST3,
//         level : 2200,
//         volume : 2201,
//     },{
//         identifier : identifiers.TANKSOUNDINGIDENTIFIERS.BALLAST4,
//         level : 2300,
//         volume : 2301,
//     }]
// }


export const tempTestingValues = {
    "isSubmit": false,
    "captain": {
        "password": "",
        "passwordError": "",
        "name": "123321"
    },
    "chiefEngineer": {
        "password": "",
        "passwordError": "",
        "name": "123321"
    },
    "vesselId": 1,
    "filepath": null,
    "chiefEngineerSignature": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAABkCAYAAACoy2Z3AAAAAXNSR0IArs4c6QAAFoNJREFUeF7tnQnwR105x78VTXpbROptIVFq1CBKKYVGiEK20VhiokihKBUjDL2iXmupUN4or5AlSyhLg1YiKSUKTWlXkUaS+XCet8f1W+7vruf87veZ+c3vv9xz7nO+59zz3Gc9l5PJCBgBI2AEjMAABC43oI2bGAEjYASMgBGQBYgXgREwAkbACAxCwAJkEGxuZASMgBEwAhYgXgNGwAgYASMwCAELkEGwuZERMAJGwAhYgHgNGAEjYASMwCAELEAGweZGRsAIGAEjYAHiNWAEjIARMAKDELAAGQSbGxkBI2AEjIAFiNeAETACRsAIDELAAmQQbG5kBIyAETACFiBeA0bACBgBIzAIAQuQQbC5kREwAkbACFiAeA0YASNgBIzAIAQsQAbB5kZGwAgYASNgAeI1YASMgBEwAoMQsAAZBJsbGQEjYASMgAWI14ARMAJLIfBJkm4i6WeWumEF9/kESXeV9GpJ95B0iaT3SHq7pH+R9A/lm5+bIwuQ5qbMDBuBJhG4s6TfKpz/kKQHNDmKfkyH0LijpNv3a3LZVQgaPkH5d35G0PD5y/J9YvfTXm4BMi2e7s0IGIHdCDxS0reUf/27pCufGVAfJ4nP50q624Jj+8MiSP5CEp8/WlKwWIAsONO+lRHYMAKfKukPyvj/S9KFkt7YMB43kvTlkj5FEmM7RqFJvFbSRxQz1lUkfWD5XP1YByf8Hw3lVyUhXBAoWaM5oZvjl1qAHMfIVxgBIzAegQ+R9IbUzd0lXTq+28V7eJikW0vCJHeMnifpSZJ+saewRJh8eBEo9M3PfPLPcc0pAgfNBL/Tr00tTCxAji0B/98IGIEpELiGpJdLQpBAD5V00RQdL9TH/YoTHP/GIXqLpMdL+p2iAczJHiYzBAzfaEF8HxMsr5T0ZEk/Jek1Y5mzABmLoNsbASPQFwE0kBAgfyrpdn0brnzdEyV91REe8PH8kiS0jjUphAkC5fMOMPLXku45ll8LkDWn2vc2AttC4M2SPqgM+R2Srlb58NmEP0fSt+7gEy0DfwZa1ZcWn86PSPr5isaEuYsxfH7Rnrqsfbek7xrDrwXIGPTc1ggYgVMQeIWkG5cGtUdiIdyeJemWnQHiz8B387Ty9xcV0xG/IiCveQogC16LIEG4EbwQ9CXFPzOYDQuQwdC54coIRPQKpgVMIzwg/1ZswkSd/Iekjyo8RiQKf7+tpCsm3mmL2eH1U9iEV8ak9tuTNPdhickbTu3UnRCAz5T0jNQfkU1PkfQNnXu8t/P7py3g+zhlmBdI+hhJmAwzIQjJxRnlB7EAOWUqfO3SCJC1TLQOxBshjlgExlsl8QZ73YkZ4mHijZIs4StIepwknI6jHrKJeWy5u5dIulkaQG2bbcb2qZK+OP3hByU9aAf4vLTknJavrijT/qrFoY+JLROmK6LD/n7sYrIAGYug20+JABEuaAhfIInFfyziZcp7H+rrzwovmACIred3PqbTEPhbSeRPBN1f0g+f1sViV78qhdDuc/jn3JZg7E6SnrkYl4dv9P2Svi1dgs/mJ8f6PfItLUAqmekNs4ET72Ml3byzueyCBM0DLYSYdkwKmLHeJgnb+jtLA8IaeVAgNBQSvaAoA/HZybQ1BvYXlI3iZyW9bExHG2rbNfeMduLOiF0WIDjM773jXl0zF5fUYpb7dEm/l3hGY/9CSb89JWYWIFOi6b6OIcAbGx8ExrWK83FfSQuylAmfRDDgw3hdiXg5do9T/h8ZxB9d+CFD+P2S2axvXwgnNsMtFQnsi01ctysUFm0OM1aNRNZ8rA9eEr6ywySFEXfNdw1mOfgG70hChPVZhLUFSI1L93x4iqJyx8o9sJGgRYRpqAbzEJoROQvwTmTNtY9MC+U5MBl8+/lM32QjwZeAT+HFxaEbHe97s5/sxiM6ygIPQYFvgzWB5kt+xb7yJfh4XjrivlM07fpvZhEeMGoBMsV0uY+MACW7qRF0nwOw8EDifCSG/q8qi1rZxzYbBlFdfFNh9fp7LhwdGnlmywm8eIMHL4oM/koa39NL8cEah0zJksiRwEy6L8P73ZLevwwAEx15LmuWZg9hHZgSbcWanIUsQGaBdXOdsknwpo7gyE7SACKKuvHN5xyIB5XPXSR9QBoQpjdCPXlwt06YBsl4hkKwZt9CvNnXhBOZ3CTeoXHkkOPMI2uYeaY8/Q+k7HquWdMHQlDCxYlRsL/vnM+cBUhNS7c9XjjX4RMl3aKziTISHjIOz/kNSW9qb2i9OcapjxDh0KAc9snvjH2rhAb6kKJ5ZBNK9i3UJEDQNq5TBB3BGV1CACI0ui9AteSBUEaeYomZZvfHWIBs9fEeNm40DfIy8G3sCrF9tKTfTYl5w+7Sbqu8OdZs358TYYQp2ea8CRNcwBt5pkelw6R+WdIXzcnMgb5Zyx8piUgqXoC6mvNjOmZY/GG7XoSyRrWWBnKvkrMUwyXiCs1oVJmSPvNiAdIHpW1fw9vYV0j60T0w8Bb555J+bNswXTZ6ks0ofzGb3blinNmwiE4i+ucb96wJNBNeNKClNBD4uUHxX92hCA5+79ITJPH5k/KPnPi4z7eVXxpotuSeyrhIrMVfE4TZ6sFLab9LDrbidW/W9iDAWyRqMHbhIN7CqAOEuhxHlBrAbSPASwbCAG2DigE4yzmDYhchZPKGN9UeFEKCtQo/8d2NlnqXpCsVxljD8Ikzf1fkX07E2xfJtJYAYXyUxM9mU8aA/2axyglTTd62H5/zGz1viDhA88OH7RfHMKq9yQgEArwB4wtj0+aMie87Ut8K0+cLS+NdJq5jyCIoIpcozsLI+Q772nOGOGuYqL/n9Ay1JXnwsaVDkvI+Y0fnXRMW2ufcYegIDUxUedyMjWrAnES4GFmALAZ1Ezf6MknfJOlWiVvCLinh4aiiJqZwMSbZvBAcvPFSJPGbe25etGPTDTqUN4FQIukUgUF4OLXRDgkL+IijY/lGu4jvIcDkUiX7kh6X9oH8nCSe00yzhuoeAs4CZMiyOr82RAzh48gPJ+c1ENlxLmG35zdr640IYYEZig2eSDvMUn3P3e4KkBz2ilkmBAabd16P2fREZYIsHPh5jtyLLED2mbCWisL60FIdGMtAEMUQ0Tr2+SdnXyEWILNDXPUNONuZk9Q+ucPl10j66ao5N3OnIMCmg6ZAob/Ll/wGNn7CVknoZKPEYfyeok2wKUY2ddY82eDROrie5DrMV0NMJnnT5bAm6qDB367w2TA9PVfS3xzwrZyCR99rc2jsviq7FFpEOwpio5/aB9Gta8W9VtM6MngWIH2X0vldx8NPiep8AA6RVETPmNpHICoCYC+PY2SHjooqugiaCKbgrRct5FRCQJBwekjoYIaKhFO++2o2p/LS5/qsgVC+5Nd3NJrTic7cwUOu6oAm9oglQnT7AGQB0gel87uma0dFC3ng+Q1zcyNC0yCvgYrDvLVOTZTtQHCcEkgRZ3PznaP5gjdyFsgdQlggWNYUGF28sgDZ5xyfS4B0o9XgDX8kRx1UQxYg1UzFYox0a+Xsi9dfjCHfaBQCbHJRVuWQpsHGzOl0XMNmTc0mBAInN2JC4gCt55fKxzhp8U3wt12Ez4EQ0m5p8IiOQlCE03tX+7eks9FnK/Q3CtX/bbyGALmzpB+XRGXoTDWdM3IZXxYgE6yyhrrIDwQPMUUB164c2hB8VbCKlkGJe8JL0TaOEcKCTbpPMARmTaLwQlMgoQ7zFYIHrYbvTPSJ8zrCafP/qE6MvwUKp3eYpniTjhDxmgVIdvhzMBOhs12aSgMBDwITunkraHuYmmvSzCxAjj11Z/h/SjWwGQRZ82hnktlUblNKgBzzZ7Ch83Lwj+UQJMrkHyI2SbLHER78jHOcpEBOCmTT4m/4LRAqnImB5nKMEBi/X8q37/J3ZPNMzQKEcYbDf18Ybx7L0PNNLi05JtRVCyKjnCOVq67wYA3k2KNwPv/HAUi4LjTUCXo+aLQzku8pFVXz5tLlniJ/vNUTpfSb5WyVYyNEILD54RyGcF7z+99JumMRGAiuXZFR3b7Z7EgixLTVR9NpSYAEr4wRU1+XELycHQKdUpoFbMmBwVzVpdqF6mX8WoAce8zO4/+3k/THZSiE/1ErhxhyU70IROFKCuV1Cc2AMyh40+eM6z6bdvRBuCwaB98Qm/5/SrpKqREVZ1vsQgbtJIQEBQgJcw1iI7xfTzjzprsvPLZnV7NflgsV7kp6pLYW8wA9qWB7iClMkJT7R3Bfr3Nhc8EsFiCzr78qbvATkr6ucIIte9JzkasY4XkxEaGbuc4RI3xGCeE8RWDQLsxUvE2jaWAG23eUcEYy+y4icS//H78A9aKC+pYP52AuDhODKNRJVGCtlEuv7BofmtyLCvOcx4Hpbxcxp1+/p8jmk4v/A+2vKbIAaWq6BjMb5Rao0UM4oqleBPAxkFmcy1W8TBK1mHBw9yVMT2xaF0m6ac9GVFXm9MC+pii67R6f2udI13zQFG/jp4QF9xzKpJeFHwQBjHkp07FsdV4CCKnepUkybsxeL5iU2wU7swBZEOwVb/XP5UzvoU6+FVnf3K2pEJtNQ5gan120CMp8EHZLdFM40yPZ7g2lxtR1i0OWa6Pq7CEQ47TIMWdH5Gxs3qY5mfIQHdt0a5v0OB+dqDQi30iqDDo0lux3zGOKqLhTNcnacFm0dn11g98IQ/ltzwKk/knv1laag2McwvjC+EwVxp35PmbKyuGxVZTkOAIyh6g9pVxDNNzzegiQLFi4nPImDzi3oqTWQOZ4POvqMz+s1DFiEZvqRYAcj3zG+lSchqaByWkqoZF5OzWcNQROCxFHPEMvlnTVYsLK2tohDYTIOAJYOIyqeW1j10K0AJnq8ay3HzKCMTFAqNQRtlkvx9vmjEgeHMtDCfMKRRHxZ1CGnzyQpTYvnMmRhEjJDTbQfdSSAGEMkTDY1ZhaM8cNXVc721mATApnlZ3lMEScdjgtTXUjgP+CCCdMJzjPeQPG55FzMvBr4ewm94O/4wPhWswrlOJfg26bjoPl4CY2V5Iad1FrAiSeo+4hWBYga6w033MxBHKphRbMBYsBU+mNomIteRrdEuc42MnsXrtK7SHoOOaYek7QvvXW56Cm2qYnTMFvLvMSeVUWILXNlPmZFIFTnJuT3tid9UaAzQlhgXkx10LiLAy0DEI9lzJD9WZ6z4Uc+4oZ7tqlTtZndZzONMt+uVOyt8fyNqY940Hrgzi29zvKzxYgY1B12+oRyEdu5tPfqmf8zBnEV8CbOhtuCI3I9A4tA+HRIlH8j4OioH2Rf/FiQ4FCzHUtEMmPJEGiCUYmvwVICzNnHgcj8EJJZNNCRIP4bPPBUI5qGIl9FCaMszHI8fjgYpZCaOzK9h510xUb/5Ok65f7d01ZWQNpyazKHKElZj+IBciKi8y3nh8BktAo2w5R8O5r57+l71AQYKMMs1QuTIimQcmLOEBpjvO8156Eh0h6eGIiB+y0uunmUOXQ5vuWMll7Pma5v6OwZoG1qk5zHSwidsgSpqSJaXoEwgHOBomJAwESRA0q7P2haUx/9/p6fFPRsOAsaxqtChDmNEKT71bm0gKkvnVnjiZEgE2N+PzYzFpxWk4IwaxdsakQdsum2D0MCFt5jUe1zgpI6jy/sb9S0o3L/1oVIFlYxJEIFiBLrSbfZzUEyEDnLOsgzCdUDjWdjgCbX/gxugIDLSMc4LsOUjr9bu23IDclzme/t6THd6Kwai/n3p2BcP5TqZj5z/6c1sYyenXZhDUawiY6yOWzg2FrIv2mLgQGmkZkWWezVBzTisA4R19GP5T2X5XP/uAYAY4TgGIjpnDk08feZMH2BDqgcTLXHPKFhv/Wcv8way3Izrq3sgBZF/8l757NCXFfykh/bylxsiQvNd8LQfHxJfCgq2GQl4HAiHLnVZ5TXSG4Lymn78EaRyk/SxIFHaEWyrlnSCMSi7+FI/3dkq4g6S6SSKTcDFmAbGaq/2egvA0+rOPc5YG4pJhetoXG+877jrDa0DAivDYERQgNaxjDVkjWQt5ezmqnThfUUhgv/GL+jXNZ0DhYG6GBHKtCPAy9iltZgFQ8OTOxxmb5tKJ+xy2itPcWckTQMHIuRoYZDQOBes7htTMtq6Pd5ooI1GS7T2nRmt8gC0OEHwLFJqyj0+8LzgkBVG3OX75JZ1Dn+AaFVoHAQHB0TVLkY4TTu+b6Uuew9i7eE7jRmgDJEWRE2SFQLEDOYYV6DCchwFGb8ckNKf3O2Qe/0FD9peAfh2aE1CI4cvJeXBN+jBAcJ4HmiwcjsCuQg85ae2nJTvOIxArtqrWxDJ7MaGgT1mgIm+6ge2padzAkHFIaHGcxIaqvLRdwrCrhi/z9yuWAIuL8/7VEpeArmNNfwL1vUKKiokQIAiOXO4+xoGXkSCk7vtdbsrkydHDR4qbL2r56GQCRWPaBrLemfOeVEdiniUzJVmza8c0DmAsFhsAJAZAFAT/HeRgX7Ail7fIZFWzDAd5qQcIp8a+lL/wejz4DsykvJJhFITRe1hzkMN5aVpr5WBwB4vHvK+maktioMTnURO+SdKXCENoQQgeBFAUI+bmVkuc14bokLxyKxcFXmVrUQHJI/F1THosFyJKryfeqGoHIsiXxi2NScRZiwnpdqW+EVkAyIsKGjYENnKNUX1NGFVoE1+WfMT0doywg6Bdh8cxiIrNGcQy9uv/fNWPdU9IT6mb5/3GXI7EIAnhiuaJFYTgKevtARsHnxiMRCOGSfSZz+k5GsuvmEyDQNWMhPBAiLVH2HeJID3OWBUhLs2hejYARaBIBtNgLC+dE/OFHaIn2BZ9YgLQ0i+bVCBiBJhGgJHqc6McAWtx480FtMQktjmPUArIJaxR8bmwEjMAABB5azhWPpoSL33JAP2s2yUdFW4CsORO+txEwAptDgPycq6VRt1YTywJEkjWQzT23HrARqAKB50u6VYeTm5Wk1CoYPMLEuSRFjsLaAmQUfG5sBIzAQARIYH1qp21Lpd3hnTFksg9k4GJwMyNgBIzAqQiQV3Sd1IgzQm5+aicrXX8vSY+zAFkJfd/WCBiBzSNAIuo9EgrvlHSjkqxaOzi7NChrILXPmvkzAkbgbBB4hKQHdUbDEQOvaGCEu3JBbtGp8dbAMMaxaB/IOPzc2ggYgeEI5JIg0Usrb/FdAUJJd8xvLx0OR3stLUDamzNzbATOBQFK2RAOm+lakt7YyAC7obw3lfTyRnifhE0LkElgdCdGwAgMRIDim9dLbVvak54t6faJ95bCkAdO1/9t1tJkTTJgd2IEjEBVCPDGno8OuGGp7FwVk3uY6QYBbG4/3dyAW1iV5tEIbAiBbk2plt7iu0EALZnfJlliFiCTwOhOjIARGIjAcyTdprR9farSO7C7RZt1fTitBABMBpIFyGRQuiMjYAQGIEBhRU7C5Ixxsrs5oKkV6gqQljLpJ8HYAmQSGN2JETACG0WA8N0gTFoP3hIOFiBbmm2P1QgYgakRoJwJZU2gu0u6dOob1NyfBUjNs2PejIARqB2Bi5LW8UhJD6yd4Sn5swCZEk33ZQSMwNYQuL+ki8ugL5FEdv1myAJkM1PtgRoBIzADAreW9NzS72Mk4UjfDFmAbGaqPVAjYARmQOCCUlH4QknfOUP/VXdpAVL19Jg5I2AEjEC9CFiA1Ds35swIGAEjUDUC/w3fkwOhVJf/gQAAAABJRU5ErkJggg==",
    "chiefEngineerName": "321",
    "captainSignature": "data:image/png;base64,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",
    "captainName": "123",
    "remark": "123321",
    "decklogs": [
        {
            "startLocation": "1",
            "endLocation": "2",
            "starttime": "2021-08-26T13:25:18+05:30",
            "endtime": "2021-08-26T13:25:18+05:30",
            "status": "Proceed",
            "typeOfJob": "Berthing",
            "tugPosition": "Bow",
            "noOfTugs": 1,
            "order": 0,
            "otherStatus": ""
        }
    ],
    "engines": [
        {
            "engineIdentifier": "S",
            "carryForwardRunningHour": 1,
            "runningHour": 1,
            "totalRunningHour": 1,
            "rpm": 1,
            "propellerRpm": 1,
            "cppPitch": 1,
            "fuelrack": "1",
            "lubOilPressure": 1,
            "freshwaterPressure": 1,
            "seawaterPressure": 1,
            "chargeAirPressure": 1,
            "turboChargerLubOilPressure": 1,
            "fuelOilPressure": 1,
            "lubOilTempBfCooler": 1,
            "lubOilTempAfCooler": 1,
            "freshwaterTempIn": 1,
            "freshwaterTempOut": 1,
            "seawaterTempIn": 1,
            "seawaterTempOut": 1,
            "turboChargerRpm": 1,
            "turboChargerExhaustTempIn": 1,
            "turboChargerExhaustTempOut": 1,
            "chargeAirTemp": 1,
            "cylinder1PeakPressure": 1,
            "cylinder1ExhaustTemp": 1,
            "cylinder2PeakPressure": 1,
            "cylinder2ExhaustTemp": 1,
            "cylinder3PeakPressure": 1,
            "cylinder3ExhaustTemp": 1,
            "cylinder4PeakPressure": 1,
            "cylinder4ExhaustTemp": 1,
            "cylinder5PeakPressure": 1,
            "cylinder5ExhaustTemp": 1,
            "cylinder6PeakPressure": 1,
            "cylinder6ExhaustTemp": 1,
            "cylinder7PeakPressure": 1,
            "cylinder7ExhaustTemp": 1,
            "cylinder8PeakPressure": 1,
            "cylinder8ExhaustTemp": 1,
            "remarks": "123"
        },
        {
            "engineIdentifier": "P",
            "carryForwardRunningHour": 2,
            "runningHour": 2,
            "totalRunningHour": 2,
            "rpm": 2,
            "propellerRpm": 2,
            "cppPitch": 2,
            "fuelrack": "2",
            "lubOilPressure": 2,
            "freshwaterPressure": 2,
            "seawaterPressure": 2,
            "chargeAirPressure": 2,
            "turboChargerLubOilPressure": 2,
            "fuelOilPressure": 2,
            "lubOilTempBfCooler": 2,
            "lubOilTempAfCooler": 2,
            "freshwaterTempIn": 2,
            "freshwaterTempOut": 2,
            "seawaterTempIn": 2,
            "seawaterTempOut": 2,
            "turboChargerRpm": 2,
            "turboChargerExhaustTempIn": 2,
            "turboChargerExhaustTempOut": 2,
            "chargeAirTemp": 2,
            "cylinder1PeakPressure": 2,
            "cylinder1ExhaustTemp": 2,
            "cylinder2PeakPressure": 2,
            "cylinder2ExhaustTemp": 2,
            "cylinder3PeakPressure": 2,
            "cylinder3ExhaustTemp": 2,
            "cylinder4PeakPressure": 2,
            "cylinder4ExhaustTemp": 2,
            "cylinder5PeakPressure": 2,
            "cylinder5ExhaustTemp": 2,
            "cylinder6PeakPressure": 2,
            "cylinder6ExhaustTemp": 2,
            "cylinder7PeakPressure": 2,
            "cylinder7ExhaustTemp": 2,
            "cylinder8PeakPressure": 2,
            "cylinder8ExhaustTemp": 2,
            "remarks": ""
        }
    ],
    "generators": [
        {
            "carryForwardRunningHour": 3,
            "runningHour": 3,
            "totalRunningHour": 6,
            "voltage": 3,
            "frequency": 3,
            "current": 3,
            "power": 3,
            "foPressue": 3,
            "loPressure": 3,
            "loTemp": 3,
            "loLevel": "Low",
            "coolingWaterTempIn": 3,
            "coolingWaterTempOut": 3,
            "exhaustTemp": 3,
            "remarks": "3",
            "generatorIdentifier": "AE 1"
        },
        {
            "carryForwardRunningHour": 4,
            "runningHour": 4,
            "totalRunningHour": 8,
            "voltage": 4,
            "frequency": 4,
            "current": 4,
            "power": 4,
            "foPressue": 4,
            "loPressure": 4,
            "loTemp": 4,
            "loLevel": "High",
            "coolingWaterTempIn": 4,
            "coolingWaterTempOut": 4,
            "exhaustTemp": 4,
            "remarks": "4",
            "generatorIdentifier": "AE 2"
        }
    ],
    "zpClutch": [
        {
            "identifier": "S",
            "zpLoLevel": "5",
            "zpLoPressure": 5,
            "zpChargeOilPressure": 5,
            "zpLoTemp": 'Low',
            "zpHoLevel": "1",
            "zpHoTempIn": 5,
            "zpHoTempOut": 5,
            "clutchOilPressure": 5,
            "zpRemarks": "123"
        },
        {
            "identifier": "P",
            "zpLoLevel": "6",
            "zpLoPressure": 6,
            "zpChargeOilPressure": 6,
            "zpLoTemp": "High",
            "zpHoLevel": "6",
            "zpHoTempIn": 6,
            "zpHoTempOut": 6,
            "clutchOilPressure": 6,
            "zpRemarks": "321"
        }
    ],
    "aircons": [
        {
            "identifier": "AC1",
            "compressorCurrent": 7,
            "compressorSuctionPressure": 7,
            "compressorDischargePressure": 7,
            "loPressure": 7,
            "coolingWaterPressure": 7
        }
    ],
    "rob": [
        {
            "identifier": "Fuel Oil",
            "carryForward": 81,
            "received": 81,
            "consumed": 81,
            "rob": 81,
            "orderid": 1
        },
        {
            "identifier": "Fresh Water",
            "carryForward": 82,
            "received": 82,
            "consumed": 82,
            "rob": 82,
            "orderid": 2
        },
        {
            "identifier": "MDO 4015",
            "carryForward": 8,
            "received": 8,
            "consumed": 8,
            "rob": 8,
            "orderid": 3
        },
        {
            "identifier": "15W-40",
            "carryForward": 9,
            "received": 9,
            "consumed": 9,
            "rob": 9,
            "orderid": 4
        },
        {
            "identifier": "Hydraulic 46",
            "carryForward": 10,
            "received": 10,
            "consumed": 10,
            "rob": 10,
            "orderid": 5
        },
        {
            "identifier": "Hydraulic 100",
            "carryForward": 11,
            "received": 11,
            "consumed": 11,
            "rob": 11,
            "orderid": 6
        },
        {
            "identifier": "Compressor Oil 100",
            "carryForward": 12,
            "received": 12,
            "consumed": 12,
            "rob": 12,
            "orderid": 7
        },
        {
            "identifier": "Super CS",
            "carryForward": 13,
            "received": 13,
            "consumed": 13,
            "rob": 13,
            "orderid": 8
        },
        {
            "identifier": "CS2",
            "carryForward": 14,
            "received": 14,
            "consumed": 14,
            "rob": 14,
            "orderid": 9
        }
    ],
    "tanksoundings": [
        {
            "identifier": "FP SW BALLAST TANK(C) ",
            "level": 15,
            "volume": 15,
            "maxdepth": 3.942,
            "maxvolume": 44.31,
            "orderid": 1
        },
        {
            "identifier": "AP SW BALLAST TANK(C) ",
            "level": 15,
            "volume": 15,
            "maxdepth": 4.002,
            "maxvolume": 21.05,
            "orderid": 2
        },
        {
            "identifier": "FRESHWATER TANK(C) ",
            "level": 15,
            "volume": 15,
            "maxdepth": 2.665,
            "maxvolume": 14.64,
            "orderid": 3
        },
        {
            "identifier": "NO1 DB FUEL OIL TANK (C) ",
            "level": 15,
            "volume": 15,
            "maxdepth": 0.521,
            "maxvolume": 12.22,
            "orderid": 4
        },
        {
            "identifier": "NO2 DB FUEL OIL TANK (P) ",
            "level": 15,
            "volume": 15,
            "maxdepth": 1.156,
            "maxvolume": 28.42,
            "orderid": 5
        },
        {
            "identifier": "NO2 DB FUEL OIL TANK (S) ",
            "level": 15,
            "volume": 15,
            "maxdepth": 1.156,
            "maxvolume": 28.42,
            "orderid": 6
        },
        {
            "identifier": "DB LUBE OIL SUMP TK (P)",
            "level": 15,
            "volume": 15,
            "maxdepth": 0.733,
            "maxvolume": 2.78,
            "orderid": 7
        },
        {
            "identifier": "DB LUBE OIL SUMP TK (S)",
            "level": 15,
            "volume": 15,
            "maxdepth": 0.733,
            "maxvolume": 2.78,
            "orderid": 8
        },
        {
            "identifier": "SLUDGE TANK (P)",
            "level": 15,
            "volume": 15,
            "maxdepth": 0.744,
            "maxvolume": 0.49,
            "orderid": 9
        }
    ],
    "vesselName": "KST 31 (ex-Kejora Satu)",
    "formDate": "2021-08-26T07:45:57.888Z",
    "generatedDate": "2021-08-26T07:45:57.888Z"
}