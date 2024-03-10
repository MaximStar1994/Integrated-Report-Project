export const MMTitleAndLabels = {
    // general: {
    //     title: "General",
    //     labels: {
    //         "name": "Name of Vessel",
    //         "location": "Location",
    //         "datetime": "Date & Time",
    //         "attendees": "Attendees",
    //         "remarks": "Remarks",
    //         "masterSignature": "Master Signature",
    //         "chiefOfficerSignature": "Chief Officer Signature",
    //         "chiefEngineerSignature": "Chief Engineer Signature",
    //         "secondOfficerSignature": "2nd Officer Signature",
    //     }
    // },
    safety: {
        title: "Safety Sharing",
        labels: {
            "environmental": "Environmental",
            "security": "Security",
            "hygiene": "Hygiene",
            "health": "Health",
            "safetyMoment": "Safety Moment"
        }
    },
    lastmeetingstatus: {
        title: "Result or Status of last meeting",
        labels: {
            "lastmeetingstatus": 'Last Meeting Status'
        }
    },
    arisingMatters: {
        title: "Arising Matters",
        labels: {
            "surveyStatus": "Survey Status",
            "crewChange": "Dry-Docking",
            "dryDock": "Crew Change",
            "others": "Others",
        }
    },
    regulation: {
        title: "Awareness of SMS, Legislative and Regulatory Changes",
        labels: {
            'SMSdocumentation': 'SMS Documentation & Changes',
            'HSSEPolicy': 'HSSE Policy',
            'masterReview': 'Master\'s Review',
            'shipboardSafetyProcedure': 'Shipboard Safety Procedure Complicated',
        }
    },
    suggestion: {
        title: "Suggestion for continual improvement",
        labels: {
            'crewTraining': 'Crew Training',
            'vendor': 'Vendor\'s Performance',
            'terminal': 'Terminal Requirement',
        }
    },
    audit: {
        title: "Monthly Audit/Inspection (Internal/External)",
        labels: {
            'navigation': 'Navigation Audit',
            'smm': 'SMM Audit',
            'superintendent': 'Superintendent Verification',
            'safetyofficer': 'Safety Officers Inspection',
            'plasticGarbage': 'Monthly Garbage (Plastic)',
            'foodGarbage': 'Monthly Garbage (Food Wastes)',
            'domesticGarbage': 'Monthly Garbage (Domestic Wastes)',
            'cookingOilGarbage': 'Monthly Garbage (Cooking Oil)',
            'operationalGarbage': 'Monthly Garbage (Operational Wastes)',
        }
    },
    correctivePreventiveAction: {
        title: "Status of Corrective and Preventive actions",
        labels: {
            'car': 'CAR',
            'lessonlearnt': 'Incident / Near Misses Lesson Learn'
        }
    },
    drillsAndExercise: {
        title: "Analysis of Shipboard drills and exercise",
        labels: {
            'analysis': 'Analysis of Shipboard drills and exercise'
        }
    },
    other: {
        title: "Other Matters",
        labels: {
            'training': 'Training Requirement',
            'issuanceOfNotice': 'Issuance of Bulletins, Circulars, Legislative and Regulatory Changes'
        }
    },
    nextMeeting: {
        title: "Tentative Date for next meeting / Review",
        labels: {
            'datetime': 'Tentative Date for next meeting / Review'
        }
    }

};

export const MMDatastructure = {
    "general": {
        "name": "",
        "location": "",
        "datetime": "",
        "attendees": "",
        "remarks": "",
        "masterSignature": null,
        "chiefOfficerSignature": null,
        "chiefEngineerSignature": null,
        "secondOfficerSignature": null
    },
    "safety": {
        "environmental": "",
        "security": "",
        "hygiene": "",
        "health": "",
        "safetyMoment": ""
    },
    "lastmeetingstatus": "",
    "arisingMatters": {
        "surveyStatus": "",
        "crewChange": "",
        "dryDock": "",
        "others": ""
    },
    "regulation": {
        "SMSdocumentation": "",
        "HSSEPolicy": "",
        "masterReview": "",
        "shipboardSafetyProcedure": ""
    },
    "suggestion": {
        "crewTraining": "",
        "vendor": "",
        "terminal": ""
    },
    "audit": {
        "navigation": "",
        "smm": "",
        "superintendent": "",
        "safetyofficer": "",
        "plasticGarbage": "",
        "foodGarbage": "",
        "domesticGarbage": "",
        "cookingOilGarbage": "",
        "operationalGarbage": ""
    },
    "correctivePreventiveAction": {
        "car": "",
        "lessonlearnt": ""
    },
    "drillsAndExercise": {
        "analysis": ""
    },
    "other": {
        "training": "",
        "issuanceOfNotice": ""
    },
    "nextMeeting": {
        "datetime": ""
    },
    "isSubmitted": false
}