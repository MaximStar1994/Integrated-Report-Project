module.exports = {
    secretPW: 's0asd2275tfadjvn123',
    secretJWT: '12vg533e3sCtWacjHp21L',
    SMTPEmail : "shikaig@k.com",
    SMTPPW : "K1234567890",
    secretCookie : 's01s8Nds0a#7djvn123',
    frontendURL : "",
    kstConfig : {
        filesLocation: "\\\\100.159.33.18\\Share\\PDF\\VesselCare\\KST\\public",
        fileLocationWithoutPublic: "\\\\100.159.33.18\\Share\\PDF\\VesselCare\\KST\\",
        apps : {

        },
        dbConfig: {
            host: 'localhost',
            database: 'kst',
            port : 5432,
            user : 'postgres',
            password : 'root',
        },
        testdbConfig : {
            host: '10.159.32.20',
            database: 'kst',
            port : 8888,
            user : 'test_user',
            password : 'password',
        },
        sqlTables : {
            USERACCOUNT : 'user_account',
            USERACCOUNTAPP : 'user_account_app',
            USERACCOUNTVESSEL : 'user_account_vessel',
            LOCK : 'lock',
            VESSEL : 'vessel',
            GENERATOR : 'generator',
            CREW : 'crew',
            SPARECREW : 'spare_crew',
            ROB: 'rob',
            TANKSOUNDING: 'tank_sounding',
            DAILYLOGFORM: 'daily_log_form',
            VESSELREPORTFORM : 'vessel_report_form',
            VESSELREPORTCREW : 'vessel_report_form_crew',
            DECKLOG : 'decklog',
            VESSELREPORTENGINELOG : 'vessel_report_enginelog',
            DAILYLOGENGINELOG : 'daily_log_enginelog',
            VESSELREPORTZPCLUTCH : 'vessel_report_zpclutch',
            VESSELREPORTGENERATOR : 'vessel_report_generator',
            DAILYLOGGENERATOR : 'daily_log_generator',
            VESSELREPORTAC : 'vessel_report_air_conditioning',
            VESSELREPORTTS : 'vessel_report_tank_sounding',
            VESSELREPORTROB : 'vessel_report_rob',
            DAILYLOGTS : 'vessel_report_tank_sounding',
            DAILYLOGROB : 'vessel_report_rob',
            TEMPERATURELOG : 'temperature_log',
            CREWTEMPERATURE : 'crew_temperature',
            VESSELDISINFECTION : 'disinfection_record',
            VESSELBREAKDOWNEVENT : 'vessel_breakdown_event',
            VESSELBREAKDOWNSUPT : 'vessel_breakdown_support',
            CREWWORKREST : 'crew_work_rest',
            CREWWORKRESTUPDATE : 'crew_work_rest_update',
            FOLDER : 'folder',
            FILE : 'file',
            FILEFOLDER : 'file_folder',
            CHATS: 'chats',
            AVAILABLEAPPS: 'available_apps',
            CHATMEMBERS: 'chat_members',
            CHATMSGS: 'chat_msgs',
            AUTHORIZEDBACKDATEDVESSELREPORTFORM: "backdated_form_submission",
            VESSELREPORTFORMSTRUCTURE: "vessel_report_form_structure",
            MARINEMORDERS: "marinem_orders",
            MARINEMTASKDETAILS: "marinem_task_details",
            MARINEMTASKSTAGESDETAILS: "marinem_task_stages_details"
        },
    },
    TIMEZONE: 'Asia/Singapore',
    //TIMEZONE: 'Asia/Kolkata',
    PLATFORM: 'web'
};