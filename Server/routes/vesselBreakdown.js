const express = require("express");
const router = express.Router();
const helper = require('../helper/helper');
const VesselBreakdownApi = require('../api/vesselBreakdownApi');
const config = require('../config/config');
const { info, err: ErrorLog } = require("../common/log");

module.exports = function(api) {

    router.get("/vesselbreakdown/data", async (req, res) => {
        info("Vessel breakdown data api starts");
        var vesselID = req.query.vesselID;
        var isManagement = (req.query.isManagement === "true");
        helper.authorize(res,req, async(user)=>{
            try{
                let vesselBreakdownData = await VesselBreakdownApi.GetBreakDownEventsForVessel(user, vesselID, isManagement);
                helper.callback(res, vesselBreakdownData, null)
                info("Vessel breakdown data api ends");
            } catch (err) {
                ErrorLog(`Vessel breakdown data api error block : ${err.message}`);
                helper.callback(res, null,err)
            }
        })
    })
    router.post("/vesselbreakdown/save", async (req, res) => {
        info("Vessel breakdown save api starts");
        var breakdown = req.body.breakdown;
        var support = breakdown.support;
        var isEditableEvent = breakdown.is_editable;
        breakdown.status = "open";
        helper.authorize(res,req, async(user)=>{
            try{
                const eventValue = await VesselBreakdownApi.PostBreakdownEvent(user, breakdown, isEditableEvent);
                support.eventId = eventValue.event_id;
                const supportValue = await VesselBreakdownApi.PostBreakdownEventSupport(user, support, isEditableEvent);
                helper.callback(res, { event: eventValue, support: supportValue }, null)
                info("Vessel breakdown save api ends");
            }
            catch (err) {
                ErrorLog(`Vessel breakdown save api error block : ${err.message}`);
                helper.callback(res, null, err);
            }
        })
    })
    router.post("/vesselbreakdown/submit", async (req, res) => {
        info("Vessel breakdown submit api starts");
        var breakdown = req.body.breakdown;
        var support = breakdown.support;
        var isEditableEvent = breakdown.is_editable;
        breakdown.status = "closed"
        helper.authorize(res,req, async(user)=>{
            try{
                const eventValue = await VesselBreakdownApi.PostBreakdownEvent(user, breakdown, isEditableEvent);
                support.eventId = eventValue.event_id;
                const supportValue = await VesselBreakdownApi.PostBreakdownEventSupport(user, support, isEditableEvent);
                await VesselBreakdownApi.GenerateVesselBreakdownForOldLogs();
                helper.callback(res, { event: eventValue, support: supportValue }, null)
                info("Vessel breakdown submit api ends");
            }
            catch (err) {
                ErrorLog(`Vessel breakdown submit api error block : ${err.message}`);
                helper.callback(res, null, err);
            }
        })
    })
    router.post("/vesselbreakdown/available", async (req, res) => {
        info("Vessel breakdown available api starts");
        var userLock = req.body.lock;
        var vesselId = req.body.vesselId;
        var accountId = req.body.accountId;
        try{
            let user = await VesselBreakdownApi.GetUserNameFromAccountId(accountId);
            const canView = await VesselBreakdownApi.CanViewVesselBreakdownPage(userLock, vesselId);
            if(canView===true){
                const lock = await VesselBreakdownApi.LockVesselBreakdownPage(userLock, vesselId, user);
                helper.callback(res, lock, null);
                info("Vessel breakdown available api ends");
            }
            else{
                let currentUser = await VesselBreakdownApi.GetCurrentUser(vesselId);
                ErrorLog(`Vessel breakdown available api error block : ${currentUser} is accessing this page now`);
                helper.callback(res, null, `${currentUser} is accessing this page now`);
            }
        }
        catch (err) {
            ErrorLog(`Vessel breakdown available api error block : ${err.message}`);
            helper.callback(res, null, err)
        };
    })
     /*
    lock : String
    */
    router.post("/vesselbreakdown/unlock", async (req, res) => {
        info("Vessel breakdown unlock api starts");
        var userLock = req.body.lock;
        var vesselId = req.body.vesselId;
        try{
            const unlock = await VesselBreakdownApi.UnlockVesselBreakdownPage(userLock, vesselId);
            helper.callback(res, unlock, null);
            info("Vessel breakdown unlock api ends");
        }
        catch (err) {
            ErrorLog(`Vessel breakdown unlock api error block : ${err.message}`);
            helper.callback(res, null, err)
        };
    })

    router.get("/vesselbreakdown/delete", async (req, res) => {
        info("Vessel breakdown delete api starts");
        var eventId = req.query.eventId;
        if (!eventId) {
            throw new Error("Something went wrong!!!");
        }
        helper.authorize(res,req, async(user)=>{
            try{
                let vesselBreakdownData = await VesselBreakdownApi.deleteVesselBreakdown(eventId);
                helper.callback(res, vesselBreakdownData, null)
                info("Vessel breakdown delete api ends");
            } catch (err) {
                ErrorLog(`Vessel breakdown delete api error block : ${err.message}`);
                helper.callback(res, null,err)
            }
        })
    })

    router.get("/vesselbreakdown/status-change", async (req, res) => {
        info("Vessel breakdown status-change api starts");
        var eventId = req.query.eventId;
        var status = req.query.status;
        var isEditable = true;
        if (!eventId) {
            throw new Error("Something went wrong!!!");
        }
        helper.authorize(res,req, async(user)=>{
            try{
                let vesselBreakdownData = await VesselBreakdownApi.vesselDowntimeStatusChange(eventId,status,isEditable);
                helper.callback(res, vesselBreakdownData, null)
                info("Vessel breakdown status-change api ends");
            } catch (err) {
                ErrorLog(`Vessel breakdown status-change api error block : ${err.message}`);
                helper.callback(res, null,err)
            }
        })
    })
    return router
}