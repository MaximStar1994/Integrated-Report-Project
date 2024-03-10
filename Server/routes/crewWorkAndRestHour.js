const express = require("express");
const router = express.Router();
const helper = require('../helper/helper');
const crewWorkAndRestHourApi = require('../api/crewWorkAndRestHourApi');
const config = require('../config/config');
const { info, err: ErrorLog } = require("../common/log");

module.exports = function(api) {
    
    router.get("/crewworkandresthour/data", async (req, res) => {
        info("Crew work and rest hour data fetch starts");
            var employeeNo = req.query.employeeNo;
            var month = req.query.month;
            var year = req.query.year;
        try{
            let data = await crewWorkAndRestHourApi.GetCrewWorkAndRestHourData(employeeNo, month, year);
            helper.callback(res, data, null);
            info("Crew work and rest hour data fetch ends");
        } catch (err) {
            ErrorLog(`Crew work and rest hour data fetch error block : ${err.message}`);
            helper.callback(res, null,err.message)
        }
    })
    router.get("/crewworkandresthour/prevsubmission", async (req, res) => {
        info("Crew work and rest hour previous submission api starts");
            var employeeNo = req.query.employeeNo;
            var month = req.query.month;
            var year = req.query.year;
        try{
            let data = await crewWorkAndRestHourApi.GetPreviousSubmission(employeeNo, month, year);
            helper.callback(res, data, null);
            info("Crew work and rest hour previous submission api ends");
        } catch (err) {
            ErrorLog(`Crew work and rest hour previous submission api error block : ${err.message}`);
            helper.callback(res, null,err.message)
        }
    })
    router.get("/crewworkandresthour/crewlist", async (req, res) => {
        info("Crew work and rest hour crew list api starts");
        try{
            let data = await crewWorkAndRestHourApi.GetCrewList();
            helper.callback(res, data, null);
            info("Crew work and rest hour crew list api ends");
        } catch (err) {
            ErrorLog(`Crew work and rest hour crew list api error block : ${err.message}`);
            helper.callback(res, null,err)
        }
    })
    router.post("/crewworkandresthour/data", async (req, res) => {
        info("Crew work and rest hour data api starts");
        let crewWorkAndRestData = req.body.crewWorkAndRestData;
        helper.authorize(res,req, async(user)=>{
            try{
                let result = await crewWorkAndRestHourApi.PostCrewWorkAndRestHourData(user, crewWorkAndRestData);
                let tableData = result.crewWorkingData;
                for (const [key, value] of Object.entries(tableData)) {
                    for (const [key2, value2] of Object.entries(value)) {
                        if(key2!=='totalRestHours')
                            tableData[key][key2] = !value2;
                    }
                }
                await crewWorkAndRestHourApi.GeneratePDF(result);
                await crewWorkAndRestHourApi.GenerateCrewWorkAndRestHourReportForOldLogs();
                helper.callback(res, [], null);
                info("Crew work and rest hour data api ends");
            } catch (err) {
                ErrorLog(`Crew work and rest hour data api error block : ${err.message}`);
                helper.callback(res, null,err)
            }
        });
    })
    router.post("/crewworkandresthour/available", async (req, res) => {
        info("Crew work and rest hour available api starts");
        var userLock = req.body.lock;
        var crewId = req.body.crewId;
        try{
            const canView = await crewWorkAndRestHourApi.CanViewCrewWorkAndRestHourPage(userLock, crewId);
            if(canView===true){
                const lock = await crewWorkAndRestHourApi.LockCrewWorkAndRestHourPage(userLock, crewId);
                helper.callback(res, lock, null);
                info("Crew work and rest hour available api ends");
            }
            else {
                ErrorLog("Crew work and rest hour available api error block : Another Device using the page now!");
                helper.callback(res, null, "Another Device using the page now!");
            }
        }
        catch (err) {
            ErrorLog(`Crew work and rest hour available api error block : ${err.message}`);
            helper.callback(res, null, err)
        };
    })
    //  /*
    // lock : String
    // */
    router.post("/crewworkandresthour/unlock", async (req, res) => {
        info("Crew work and rest hour unlock api starts");
        var userLock = req.body.lock;
        var crewId = req.body.crewId;
        try{
            const unlock = await crewWorkAndRestHourApi.UnlockCrewWorkAndRestHourPage(userLock, crewId);
            helper.callback(res, unlock, null);
            info("Crew work and rest hour unlock api ends");
        }
        catch (err) {
            ErrorLog(`Crew work and rest hour unlock api error block : ${err.message}`);
            helper.callback(res, null, err)
        };
    })

    router.get("/crewworkandresthour/update", async (req, res) => {
        info("Crew work and rest hour update api starts");
        var month = req.query.month;
        var year = req.query.year;
        try{
            let data = await crewWorkAndRestHourApi.GetCrewWorkAndRestHourUpdate(month, year);
            helper.callback(res, data, null);
            info("Crew work and rest hour update api ends");
        } catch (err) {
            ErrorLog(`Crew work and rest hour update api error block : ${err.message}`);
            helper.callback(res, null,err.message)
        }
    })
    router.post("/crewworkandresthour/update", async (req, res) => {
        info("Crew work and rest hour update api starts");
        let crewWorkAndRestUpdateData = req.body.crewWorkAndRestUpdateData;
        helper.authorize(res,req, async(user)=>{
            try{
                let result = await crewWorkAndRestHourApi.PostCrewWorkAndRestHourUpdateData(user, crewWorkAndRestUpdateData);
                helper.callback(res, [], null);
                info("Crew work and rest hour update api ends");
            } catch (err) {
                ErrorLog(`Crew work and rest hour update api error block : ${err.message}`);
                helper.callback(res, null,err)
            }
        });
    })
    return router
}