const express = require("express");
const router = express.Router();
const helper = require('../helper/helper');
const crewPlanningApi = require('../api/crewPlanningApi');
const config = require('../config/config');
const { info, err: ErrorLog } = require("../common/log");
module.exports = function(api) {
    
    router.get("/crewplanning/data", async (req, res) => {
        info("Crew planning fetch data starts");
        try{
            let crewPlanningData = await crewPlanningApi.GetCrewPlanningData();
            let spareCrewData = await crewPlanningApi.GetSpareCrewData();
            helper.callback(res, { crew: crewPlanningData, spare: spareCrewData }, null);
            info("Crew planning fetch data ends");
        } catch (err) {
            ErrorLog(`Crew planning fetch data error block : ${err.message}`);
            helper.callback(res, null,err)
        }
    })
    router.post("/crewplanning/data", async (req, res) => {
        info("Crew planning fetch data starts");
        let crewPlanningData = req.body.crewPlanningData;
        let spare = req.body.spare;
        helper.authorize(res,req, async(user)=>{
            try{
                await crewPlanningApi.UpdateCrewPlanningData(crewPlanningData);
                await crewPlanningApi.UpdateSpareData(spare);
                helper.callback(res, [], null);
                info("Crew planning fetch data ends");
            } catch (err) {
                ErrorLog(`Crew planning fetch data error block : ${err.message}`);
                helper.callback(res, null,err)
            }
        });
    })
    router.post("/crewplanning/available", async (req, res) => {
        info("Crew planning available starts");
        var userLock = req.body.lock;
        var accountId = req.body.accountId;
        try{
            let user = await crewPlanningApi.GetUserNameFromAccountId(accountId);
            const canView = await crewPlanningApi.CanViewCrewPlanningPage(userLock);
            if(canView===true){
                const lock = await crewPlanningApi.LockCrewPlanningPage(userLock, user);
                helper.callback(res, lock, null);
                info("Crew planning available ends");
            }
            else{
                let currentUser = await crewPlanningApi.GetCurrentUser();
                ErrorLog(`Crew planning available error block : ${currentUser} is accessing this page now`);
                helper.callback(res, null, `${currentUser} is accessing this page now`);
            }
        }
        catch (err) {
            ErrorLog(`Crew planning available error block : ${err.message}`);
            helper.callback(res, null, err);
        };
    })
     /*
    lock : String
    */
    router.post("/crewplanning/unlock", async (req, res) => {
        info("Crew planning unlock starts");
        var userLock = req.body.lock;
        try{
            const unlock = await crewPlanningApi.UnlockCrewPlanningPage(userLock);
            helper.callback(res, unlock, null);
            info("Crew planning unlock ends");
        }
        catch (err) {
            ErrorLog(`Crew planning unlock error block : ${err.message}`);
            helper.callback(res, null, err);
        };
    })
    return router
}