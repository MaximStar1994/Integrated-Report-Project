const express = require("express");
const router = express.Router();
const helper = require('../helper/helper');
const dailyLogApi = require('../api/dailyLogApi');
const config = require('../config/config');
const { info, err: ErrorLog } = require("../common/log");

module.exports = function(api) {
    
    router.get("/dailylog/list", async (req, res) => {
        info("Daily log list fetch starts");
        var vesselID = req.query.vesselID;
        try{
            const list = await dailyLogApi.ListDailyLogs(vesselID);
            helper.callback(res, list, null);
            info("Daily log list fetch ends");
        }
        catch (err) {
            ErrorLog(`Daily log list fetch error block : ${err.message}`);
            helper.callback(res, null, err);
        }
    })

    router.post("/dailylog/sync", (req, res) => {
        info("Daily log save starts");
        var dailylogs = req.body.logs
        helper.authorize(res,req, async(user)=>{
            try{
                const value = await dailyLogApi.SyncDailyLogs(user, dailylogs);
                // await dailyLogApi.GenerateDailyLogsForOldLogs();
                helper.callback(res, value, null);
                info("Daily log save ends");
            }
            catch (err) {
                ErrorLog(`Daily log save error block : ${err.message}`);
                helper.callback(res, null, err);
            }
            
                // if (user.apps instanceof Array && user.apps.includes(config.fuellngConfig.apps.OPERATION)) {
                    // dailyLogApi.GenerateElogForOld(()=>{
                    //     helper.callback(res,val,err)
                    // })
                // } else {
                //     helper.callback(res,null,"User unauthorized to perform this operation")
                // }
           
        })
    })

    router.get("/dailylog/pdf-generation",async(req,res) => {
        info("Daily log PDF generation starts");
        helper.authorize(res,req,async(user) => {
        try {
          await dailyLogApi.GenerateDailyLogsForOldLogs();
          helper.callback(res,true,null);
          info("Daily log PDF generation ends");
        } catch (error) {
          ErrorLog(`Daily log PDF generation error block : ${err.message}`);
          helper.callback(res, null, err);
        }
      });     
    });

    router.post("/dailylog/available", async (req, res) => {
        info("Daily log available api starts");
        var userLock = req.body.lock;
        var vesselID = req.body.vesselID;
        var accountType = req.body.accountType;
        try {
            var canView = true;
            if (accountType !== "vessel") {
                canView = await dailyLogApi.CanViewDailyLogPage(userLock, vesselID);
            }
            if(canView===true){
                const lock = await dailyLogApi.LockDailyLogPage(userLock, vesselID, accountType);
                helper.callback(res, lock, null);
                info("Daily log available api ends");
            }
            else {
                ErrorLog("Daily log available api error block : ther Device using the page now");
                helper.callback(res, null, "Another Device using the page now!");
            }
        }
        catch (err) {
            ErrorLog(`Daily log available api error block : ${err.message}`);
            helper.callback(res, null, err)
        };
    })
     /*
    lock : String
    */
    router.post("/dailylog/unlock", async (req, res) => {
        info("Daily log unlock api starts");
        var userLock = req.body.lock;
        var vesselID = req.body.vesselID;
        try{
            const unlock = await dailyLogApi.UnlockDailyLogPage(userLock, vesselID);
            helper.callback(res, unlock, null);
            info("Daily log unlock api ends");
        }
        catch (err) {
            ErrorLog(`Daily log unlock api error block : ${err.message}`);
            helper.callback(res, null, err)
        };
    })
    router.get("/dailylog/structure", async (req, res) => {
        info("Daily log structure api starts");
        var vesselID = req.query.vesselID;
        try{
            const vessel = await dailyLogApi.GetVessel(vesselID);
            const rob = await dailyLogApi.GetRobStructure(vesselID);
            const generators = await dailyLogApi.GetGeneratorStructure(vesselID);
            const tankSounding = await dailyLogApi.GetTankSounding(vesselID);
            let LNGProperties = false;
            if(vesselID==='10'||vesselID==='11'){
                LNGProperties=true;
            }
            helper.callback(res, { generators: generators, rob: rob, tankSounding: tankSounding, vessel: vessel, LNGProperties: LNGProperties }, null);
            info("Daily log structure api ends");
        }
        catch (err) {
            ErrorLog(`Daily log structure api error block : ${err.message}`);
            helper.callback(res, null, err)
        };
    })
    return router
}