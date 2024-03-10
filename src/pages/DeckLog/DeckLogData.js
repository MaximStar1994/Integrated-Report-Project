export const GeneralInfoList = ['infoFrom', 'infoTo', 'lyingAt'];

export const HourlyEntriesList = {
    hourInterval: ['timeInterval'],
    GPSPositionOfVessel_CourseOfVessel: ['lat', 'lng', 'trueCourse', 'gyro', 'mag'],
    Wind_SeaCondition_Visibility: ['windForce', 'windDirection', 'seaCondition', 'visibility'],
    Swell_Temperature: ['swellDirection', 'swellHeight', 'dryTemp', 'wetTemp'],
    BarometricPressure_CourseAlteration_EngineRoomWatchStatus: ['barometricPressure', 'engineRoomWatchStatus', 'courseAlteration']
};

export const FourHourlyEntriesList = {
    hourInterval: ['timeInterval'],
    CONAndWatchChangeOverTimeAndOfficerDetails: ['column_1', 'column_2', 'column_3', 'column_4', 'column_5', 'column_6', 'column_7'],
    TestingOfPropulsionAndSteering: ['column_1', 'column_2', 'column_3', 'column_4', 'column_5', 'column_6', 'column_7'],
    Gyro_Magnetic: ['gyroError', 'magneticVariation', 'magneticDeviation'],
    TimingRelatedToMomentOfVessel: ['column_1', 'column_2', 'column_3', 'column_4', 'column_5', 'column_6', 'column_7'],
    BridgeWatchLevel_BNWAS_SecurityLevel_OfficerSignature: ['bridgeWatchLevel', 'BNWAS', 'securityLevel', 'officerSignature']
};

export const AdditionalEntriesAtNoonList = ['lat', 'lng', 'distanceRunHRStreaming', 'distanceRunSeaStreaming', 'avgSpeed'];

export const OnceInADayList = {
    tank1:{
        "liquidVolume": null,
        "liquidTemp": null,
        "vaporTemp": null,
        "pressure": null,
    },
    tank2:{
        "liquidVolume": null,
        "liquidTemp": null,
        "vaporTemp": null,
        "pressure": null,
    },
    sounding:{
        "tank1c": null,
        "tank2p": null,
        "tank3p": null,
        "tank4p": null,
        "tank5p": null,
        "tank6p": null,
        "tank7p": null,
        "tank8p": null,
        "tank9p": null,
        "tank10p": null,
        "tank21p": null,
        "tank2s": null,
        "tank3s": null,
        "tank4s": null,
        "tank5s": null,
        "tank6s": null,
        "tank7s": null,
        "tank8s": null,
        "tank9s": null,
        "tank10s": null,
        "tank21s": null,
    },
    voidspaceSounding:{
        "tank6c": null,
        "tank1p": null,
        "tank4p": null,
        "tank5p": null,
        "tank1s": null,
        "tank4s": null,
        "tank5s": null,
    },
    draft:{
        "arrivalForward": null,
        "arrivalAft": null,
        "sailingForward": null,
        "sailingAft": null,
    }
    // CargoTankStatusPort: ['portTankSounding', 'portTankAverageTemperatureLiquid', 'portTankAverageTemperatureVapor', 'portTankPressure'],
    // CargoTankStatusStarboard: ['starboardTankSounding', 'starboardTankAverageTemperatureLiquid', 'starboardTankAverageTemperatureVapor', 'starboardTankPressure'],
    // SoundingInBallastWaterTankC: ['soundingBallastTank1C'],
    // SoundingInBallastWaterTankP: ['soundingBallastTank2P', 'soundingBallastTank3P', 'soundingBallastTank4P', 'soundingBallastTank5P', 'soundingBallastTank6P', 'soundingBallastTank7P', 'soundingBallastTank8P', 'soundingBallastTank9P', 'soundingBallastTank10P', 'soundingBallastTank21P'],
    // SoundingInBallastWaterTankS: ['soundingBallastTank2S', 'soundingBallastTank3S', 'soundingBallastTank4S', 'soundingBallastTank5S', 'soundingBallastTank6S', 'soundingBallastTank7S', 'soundingBallastTank8S', 'soundingBallastTank9S', 'soundingBallastTank10S', 'soundingBallastTank21S'],
    // SoundingInVoidSpacesP: ['soundingVoideSpaces1P', 'soundingVoideSpaces4P', 'soundingVoideSpaces5P'],
    // SoundingInVoidSpacesS: ['soundingVoideSpaces1S', 'soundingVoideSpaces4S', 'soundingVoideSpaces5S'],
    // SoundingInVoidSpacesC: ['soundingVoideSpaces6C'],
    // VesselDraftArrival: ['vesselDraftFArrival', 'vesselDraftAArrival'],
    // VesselDraftSailing: ['vesselDraftFSailing', 'vesselDraftASailing',]
}

export const OnceInADayMap = {
    cargoTank1Status: {
        'liquidVolume': 'Liquid Volume',
        'liquidTemp': 'Avg. Temperature Liquid',
        'vaporTemp': 'Avg. Temperature Vapor',
        'pressure': 'Pressure', 
    },
    cargoTank2Status: {
        'liquidVolume': 'Liquid Volume',
        'liquidTemp': 'Avg. Temperature Liquid',
        'vaporTemp': 'Avg. Temperature Vapor',
        'pressure': 'Pressure',
    },
    soundingInBallastWaterTankC: {
        'tank1c': 'Tank 1C',},
    soundingInBallastWaterTankP: {
        'tank2p': 'Tank 2P',
        'tank3p': 'Tank 3P',
        'tank4p': 'Tank 4P',
        'tank5p': 'Tank 5P',
        'tank6p': 'Tank 6P',
        'tank7p': 'Tank 7P',
        'tank8p': 'Tank 8P',
        'tank9p': 'Tank 9P',
        'tank10p': 'Tank 10P',
        'tank21p': 'Tank 21P',},
    soundingInBallastWaterTankS: {
        'tank2s': 'Tank 2S',
        'tank3s': 'Tank 3S',
        'tank4s': 'Tank 4S',
        'tank5s': 'Tank 5S',
        'tank6s': 'Tank 6S',
        'tank7s': 'Tank 7S',
        'tank8s': 'Tank 8S',
        'tank9s': 'Tank 9S',
        'tank10s': 'Tank 10S',
        'tank21s': 'Tank 21S',},
    soundingInVoidSpacesP: {
        'tank1p': 'Tank 1P',
        'tank4p': 'Tank 4P',
        'tank5p': 'Tank 5P',},
    soundingInVoidSpacesS: {
        'tank1s': 'Tank 1S',
        'tank4s': 'Tank 4S',
        'tank5s': 'Tank 5S',},
    soundingInVoidSpacesC: {
        'tank6c': 'Tank 6C',},
    vesselDraftArrival: {
        'arrivalForward':'Forward',
        'arrivalAft':'Aft.',
    },
    vesselDraftSailing: {
        'sailingForward':'Forward',
        'sailingAft':'Aft.',
    }
}

export const AdditionalColumnForDailyMiscellaneousEntriesList = {
    WeeklyAndMonthlyInspectionAndTestingOfLSAEquipment: ['column_1', 'column_2', 'column_3', 'column_4', 'column_5', 'column_6', 'column_7'],
    EntriesOfVariousDrillsAndTrainings: ['column_1', 'column_2', 'column_3', 'column_4', 'column_5', 'column_6', 'column_7'],
    ResultsOfPreArrivalCargoChecksAndTests: ['column_1', 'column_2', 'column_3', 'column_4', 'column_5', 'column_6', 'column_7'],
    RecordsOfVariousMeetingCarriedOut: ['column_1', 'column_2', 'column_3', 'column_4', 'column_5', 'column_6', 'column_7'],
}

export const FireAndSafetyRounds_UMSList = {
    FireAndSafetyRound: ['from', 'to', 'by'],
    UMS: ['startTime', 'stopTime'],
}

export const hourlyIntervalsList = {
    0: '0000 - 0059',
    1: '0100 - 0159',
    2: '0200 - 0259',
    3: '0300 - 0359',
    4: '0400 - 0459',
    5: '0500 - 0559',
    6: '0600 - 0659',
    7: '0700 - 0759',
    8: '0800 - 0859',
    9: '0900 - 0959',
    10: '1000 - 1059',
    11: '1100 - 1159',
    12: '1200 - 1259',
    13: '1300 - 1359',
    14: '1400 - 1459',
    15: '1500 - 1559',
    16: '1600 - 1659',
    17: '1700 - 1759',
    18: '1800 - 1859',
    19: '1900 - 1959',
    20: '2000 - 2059',
    21: '2100 - 2159',
    22: '2200 - 2259',
    23: '2300 - 2359',
}

export const fourHourlyIntervalsList = {
    0: '0000 - 0359',
    1: '0400 - 0759',
    2: '0800 - 1159',
    3: '1200 - 1559',
    4: '1600 - 1959',
    5: '2000 - 2359',
}

export const ReverseHourlyIntervalsList = {
    0: '0000 - 0059',
    1: '0100 - 0159',
    2: '0200 - 0259',
    3: '0300 - 0359',
    4: '0400 - 0459',
    5: '0500 - 0559',
    6: '0600 - 0659',
    7: '0700 - 0759',
    8: '0800 - 0859',
    9: '0900 - 0959',
    10: '1000 - 1059',
    11: '1100 - 1159',
    12: '1200 - 1259',
    13: '1300 - 1359',
    14: '1400 - 1459',
    15: '1500 - 1559',
    16: '1600 - 1659',
    17: '1700 - 1759',
    18: '1800 - 1859',
    19: '1900 - 1959',
    20: '2000 - 2059',
    21: '2100 - 2159',
    22: '2200 - 2259',
    23: '2300 - 2359',
}

export const ReverseFourHourlyIntervalsList = {
    0: '0000 - 0359',
    1: '0400 - 0759',
    2: '0800 - 1159',
    3: '1200 - 1559',
    4: '1600 - 1959',
    5: '2000 - 2359',
}