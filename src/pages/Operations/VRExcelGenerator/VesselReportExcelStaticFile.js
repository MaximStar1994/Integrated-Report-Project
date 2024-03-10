
var valueCount = 30;
const columns = [
    { title: "Report", width: { wch: 14 }, style: { fill: { patternType: "solid", fgColor: { rgb: "FF04588e" } }, font: { color: { rgb: "FFFFFFFF" } } } },
    { title: "Category", width: { wch: 25 }, style: { fill: { patternType: "solid", fgColor: { rgb: "FF04588e" } }, font: { color: { rgb: "FFFFFFFF" } } } },
    { title: "Tag name", width: { wch: 0 }, style: { fill: { patternType: "solid", fgColor: { rgb: "FF04588e" } }, font: { color: { rgb: "FFFFFFFF" } } } },
    { title: "Identifiers", width: { wch: 0 }, style: { fill: { patternType: "solid", fgColor: { rgb: "FF04588e" } }, font: { color: { rgb: "FFFFFFFF" } } } },
    { title: "Display name", width: { wch: 40 }, style: { fill: { patternType: "solid", fgColor: { rgb: "FF04588e" } }, font: { color: { rgb: "FFFFFFFF" } } } },
    { title: "Units", width: { wch: 24 }, style: { fill: { patternType: "solid", fgColor: { rgb: "FF04588e" } }, font: { color: { rgb: "FFFFFFFF" } } } },
];

const dailyLogStructure = {
    "Acknowledgements": "",
    "Engine Running Hours": {
        "S": "engines",
        "P": "engines",
        "AE 1": "generators",
        "AE 2": "generators"
    },
    "Consumables ROB": "rob",
    "Tank Soundings": "tanksoundings"
}

for (var i = 0; i < valueCount; i++) {
    columns.push(
        { title: "Entry "+ (i+1).toString(), width: { wch: 24 }, style: { fill: { patternType: "solid", fgColor: { rgb: "FF04588e" } }, font: { color: { rgb: "FFFFFFFF" } } } }
    );
}

const vesselReportCategories = {
    ACKNOWLEDGEMENTS: 'Acknowledgements',
    CREWONBOARD: 'Crew On Board',
    DECKLOGINFO: 'Deck Log Info',
    ENGINES: 'Engines',
    GENERATORS: 'Generators',
    AZIMUTHTHRUSTER: 'Azimuth Thruster',
    AIRCONDITIONING: 'Air Conditioning',
    SENGINEIDENTIFIER: 'S',
    PENGINEIDENTIFIER: 'P',
    AE1GENERATORIDENTIFIER: 'AE 1',
    AE2GENERATORIDENTIFIER: 'AE 2',
    AE3GENERATORIDENTIFIER: 'AE 3',
    AC1AIRCONDITIONINGIDENTIFIER: 'AC1',
    MORNINGSHIFTIDENTIFIER: 'Morning Shift Log',
    EVENINGSHIFTIDENTIFIER: 'Evening Shift Log'
}
    

module.exports = {
    columns : [...columns],
    dailyLogStructure: dailyLogStructure,
    VESSELREPORTCATEGORIES: vesselReportCategories
}