const express = require("express");
const router = express.Router();
const helper = require('../helper/helper');
const vesselDisinfectionApi = require('../api/vesselDisinfectionApi');
const config = require('../config/config');
const { info, err: ErrorLog } = require("../common/log");

module.exports = function(api) {
    
    router.get("/vesseldisinfection/vesseldata", async (req, res) => {
        info("Vessel disinfection vessel data fetch api starts");
        var vesselID = req.query.vesselID;
        try{
            let crewPlanningData = await vesselDisinfectionApi.GetVessel(vesselID);
            helper.callback(res, crewPlanningData, null)
            info("Vessel disinfection vessel data fetch api ends");
        } catch (err) {
            ErrorLog(`Vessel disinfection vessel data fetch api error block : ${err.message}`);
            helper.callback(res, null,err)
        }
    })
    router.post("/vesseldisinfection/sync", async (req, res) => {
        info("Vessel disinfection save api starts");
        var vesselDisinfectionReports = req.body.logs
        helper.authorize(res,req, async(user)=>{
            try{
                const value = await vesselDisinfectionApi.SyncDisinfectionLogs(user, vesselDisinfectionReports);
                await vesselDisinfectionApi.GenerateVesselDisinfectionForOldLogs();
                helper.callback(res, value, null)
                info("Vessel disinfection save api ends");
            }
            catch (err) {
                ErrorLog(`Vessel disinfection save api error block : ${err.message}`);
                helper.callback(res, null, err);
            }
        })
    })
    router.post("/vesseldisinfection/available", async (req, res) => {
        info("Vessel disinfection available api starts");
        var userLock = req.body.lock;
        var vesselID = req.body.vesselID;
        var accountType = req.body.accountType;
        try {
            var canView = true;
            if (accountType !== "vessel") {
                canView = await vesselDisinfectionApi.CanViewVesselDisinfectionPage(userLock, vesselID);
            }
            if(canView===true){
                const lock = await vesselDisinfectionApi.LockVesselDisinfectionPage(userLock, vesselID, accountType);
                helper.callback(res, lock, null);
                info("Vessel disinfection available api ends");
            }
            else {
                ErrorLog("Vessel disinfection available api error block : Another Device using the page now!");
                helper.callback(res, null, "Another Device using the page now!");
            }
        }
        catch (err) {
            ErrorLog(`Vessel disinfection available api error block : ${err.message}`);
            helper.callback(res, null, err)
        };
    })
     /*
    lock : String
    */
    router.post("/vesseldisinfection/unlock", async (req, res) => {
        info("Vessel disinfection unlock api starts");
        var userLock = req.body.lock;
        var vesselID = req.body.vesselID;
        try{
            const unlock = await vesselDisinfectionApi.UnlockVesselDisinfectionPage(userLock, vesselID);
            helper.callback(res, unlock, null);
            info("Vessel disinfection unlock api ends");
        }
        catch (err) {
            ErrorLog(`Vessel disinfection unlock api error block : ${err.message}`);
            helper.callback(res, null, err)
        };
    })
    router.get("/vesseldisinfection/checksubmissionfortoday", async (req, res) => {
        info("Vessel disinfection check submission api starts");
        var vesselID = req.query.vesselId;
        try{
            const todaySubmission = await vesselDisinfectionApi.CheckSubmissionForToday(vesselID);
            helper.callback(res, todaySubmission, null);
            info("Vessel disinfection check submission api ends");
        }
        catch (err) {
            ErrorLog(`Vessel disinfection check submission api error block : ${err.message}`);
            helper.callback(res, null, err)
        };
    })
    return router
}