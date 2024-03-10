const express = require("express");
const router = express.Router();
const helper = require('../helper/helper');
const crewTemperatureReportApi = require('../api/crewTemperatureReportApi');
const config = require('../config/config');
const { info, err: ErrorLog } = require("../common/log");

module.exports = function(api) {

    router.get("/crewtemperaturereport/list", async (req, res) => {
        info("Crew temperature report data fetch starts");
        var vesselID = req.query.vesselID;
        try{
            const list = await crewTemperatureReportApi.ListTemperatureReports(vesselID);
            helper.callback(res, list, null);
            info("Crew temperature report data fetch ends");
        }
        catch (err) {
            ErrorLog(`Crew temperature report data fetch error block : ${err.message}`);
            helper.callback(res, null, err);
        }
    })
    router.post("/crewtemperaturereport/sync", (req, res) => {
        info("Crew temperature report data save starts");
        var vesselReports = req.body.logs
        helper.authorize(res,req, async(user)=>{
            try{
                const value = await crewTemperatureReportApi.SyncTemperatureReports(user, vesselReports);
                await crewTemperatureReportApi.GenerateTemperatureReportsForOldLogs();
                helper.callback(res, value, null);
                info("Crew temperature report data save ends");
            }
            catch (err) {
                ErrorLog(`Crew temperature report data save error block : ${err.message}`);
                helper.callback(res, null, err);
            }
            
                // if (user.apps instanceof Array && user.apps.includes(config.fuellngConfig.apps.OPERATION)) {
                    // crewTemperatureReportApi.GenerateElogForOld(()=>{
                    //     helper.callback(res,val,err)
                    // })
                // } else {
                //     helper.callback(res,null,"User unauthorized to perform this operation")
                // }
           
        })
    })
    router.post("/crewtemperaturereport/available", async (req, res) => {
        info("Crew temperature report data available starts");
        var userLock = req.body.lock;
        var vesselID = req.body.vesselID;
        var accountType = req.body.accountType;
        try {
            var canView = true;
            if (accountType !== "vessel") {
                canView = await crewTemperatureReportApi.CanViewCrewTemperatureReportPage(userLock, vesselID);
            }
            if(canView===true){
                const lock = await crewTemperatureReportApi.LockTemperatureReportPage(userLock, vesselID, accountType);
                helper.callback(res, lock, null);
                info("Crew temperature report data available ends");
            }
            else {
                ErrorLog("Crew temperature report Another Device using the page now!");
                helper.callback(res, null, "Another Device using the page now!");
            }
        }
        catch (err) {
            ErrorLog(`Crew temperature report data available error block : ${err.message}`);
            helper.callback(res, null, err)
        };
    })
     /*
    lock : String
    */
    router.post("/crewtemperaturereport/unlock", async (req, res) => {
        info("Crew temperature report unlock starts");
        var userLock = req.body.lock;
        var vesselID = req.body.vesselID;
        try{
            const unlock = await crewTemperatureReportApi.UnlockCrewTemperatureReportPage(userLock, vesselID);
            helper.callback(res, unlock, null);
            info("Crew temperature report unlock ends");
        }
        catch (err) {
            ErrorLog(`Crew temperature report unlock error block : ${err.message}`);
            helper.callback(res, null, err)
        };
    })
    router.get("/crewtemperaturereport/vesseldata", async (req, res) => {
        info("Crew temperature report vesseldata starts");
        var vesselID = req.query.vesselId;
        try{
            const vesselData = await crewTemperatureReportApi.GetVesselData(vesselID);
            helper.callback(res, vesselData, null);
            info("Crew temperature report vesseldata ends");
        }
        catch (err) {
            ErrorLog(`Crew temperature report vesseldata error block : ${err.message}`);
            helper.callback(res, null, err)
        };
    })
    router.get("/crewtemperaturereport/checksubmissionfortoday", async (req, res) => {
        info("Crew temperature report check submission for today starts");
        var vesselID = req.query.vesselId;
        try{
            const todaySubmission = await crewTemperatureReportApi.CheckSubmissionForToday(vesselID);
            helper.callback(res, todaySubmission, null);
            info("Crew temperature report check submission for today ends");
        }
        catch (err) {
            ErrorLog(`Crew temperature report check submission for today error block : ${err.message}`);
            helper.callback(res, null, err)
        };
    })
    return router
}