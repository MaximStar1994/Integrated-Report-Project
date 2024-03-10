import React from 'react';

export const mainInfo1 = {
    hullNo: 'H410',
    nameOfVessel: 'FUELNG BELLINA',
    callSign: '9V6788',
    IMONo: '9859636',
    owner: 'FueLNG Pte Ltd',
    lengthOA: '119.50',
    lengthPP: '114.708 m',
    breadthMoulded: '19.50 m',
    depthToMainDeck: '9.50 m',
    summerDraght: '5.70 m',
    deadweight: 'About 5,345 ton',
    workingLanguageOnboard: 'ENGLISH'
}

export const mainInfo1Header = {
    hullNo: 'Hull No.: ',
    nameOfVessel: 'Name of Vessel: ',
    callSign: 'Call Sign: ',
    IMONo: 'IMO No.: ',
    owner: 'Owner: ',
    lengthOA: 'Length O.A.: ',
    lengthPP: 'Length P.P.: ',
    breadthMoulded: 'Bread Moulded: ',
    depthToMainDeck: 'Depth To Main Deck: ',
    summerDraght: 'Summer Draught: ',
    deadweight: <>Deadweight <br /> (at draught of 5.70 m): </>,
    workingLanguageOnboard: 'Working Language Onboard:'
}

export const mainDieselEngine = {
    quantity: '3',
    maker: 'Wartsila 2x6L20DF + 1x8L20DF',
    capacity: <>6L20DF_1110 kW @ 1200 rpm<br />
    8L20DF_1480 kW @ 1200 rpm</>,
}

export const generator = {
    quantity: '3',
    maker: <>HYUNDAI 2XHFJ6 562-64E + 1XHFJ5 <br /> 632-64E</>,
    capacity: <>HFJ6 562-64E_1250kVA @ 1200 rpm <br /> HFJ5 632-64E_1680kVA @ 1200 rpm</>,
    vhp: '440V / 60Hz / 3PH',
}

export const azimuthThruster = {
    quantity: '2',
    maker: 'NGC Marine NRP140',
    ratePower: '1000 kW',
    inputSpeed: '900 rpm',
    propellerDiameter: '2200 mm',
    propeller: 'Single Propeller, 4-blade',
    rotateDirection: <>PS rotate counterclockwise <br /> STBD rotate clockwise</>,
}

export const eMotor = {
    quantity: '2',
    maker: 'ABB AMI 450L8L BAFMS',
    rateOutputPower: '1000 kW',
    ratedVoltage: '440 V',
    ratedTorque: '10610 N.m',
    ratedCurrent: '1707 A',
    ratedFrequency: '60.5 Hz',
    ratedSpeed: '900 rpm',
    cooling: 'Fresh Water Cooled',
}

export const mainDieselEngineHeader = {
    quantity: 'Quantity',
    maker: 'Maker',
    capacity: 'Capacity',
}

export const generatorHeader = {
    quantity: 'Quantity',
    maker: 'Maker',
    capacity: 'Capacity',
    vhp: 'V / H / P',
}

export const azimuthThrusterHeader = {
    quantity: 'Quantity',
    maker: 'Maker',
    ratePower: 'Rate Power',
    inputSpeed: 'Input Speed',
    propellerDiameter: 'Propeller Diameter',
    propeller: 'Propeller',
    rotateDirection: 'Rotate Direction',
}

export const eMotorHeader = {
    quantity: 'Quantity',
    maker: 'Maker',
    rateOutputPower: 'Rate Output Power',
    ratedVoltage: 'Rated Voltage',
    ratedTorque: 'Rated Torque',
    ratedCurrent: 'Rated Current',
    ratedFrequency: 'Rated Frequency',
    ratedSpeed: 'Rated Speed',
    cooling: 'Cooling',
}