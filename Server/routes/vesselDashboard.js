const express = require("express");
const router = express.Router();
const helper = require('../helper/helper');
const vesselDashboardApi = require('../api/vesselDashboardApi');
const { info, err: ErrorLog } = require("../common/log");

module.exports = function(api) {

    router.get("/vesseldashboard/getdata", async (req, res) => {
        info("Vessel dashboard data fetch api starts");
        var vesselId = req.query.vesselId;
        var today = req.query.today;
        try{
            const data = await vesselDashboardApi.GetVesselDashboardData(vesselId, today);
            helper.callback(res, data, null);
            info("Vessel dashboard data fetch api ends");
        }
        catch (err) {
            ErrorLog(`Vessel dashboard data fetch api error block : ${err.message}`);
            helper.callback(res, null, err);
        }
    })

    router.get("/vesseldashboard/get_last_five_marinem_data", async (req, res) => {
        info("Vessel dashboard last five marinem data fetch api starts"); 
        helper.authorize(res, req, async (user) => {
            try {
                var vesselId = req.query.vesselId;
                if (helper.IsEmpty(vesselId)) {
                    throw new Error("Something Went Wrong!!!")
                }
                const data = await vesselDashboardApi.GetVesselDashboardLastFiveMarinemData(vesselId);
                helper.callback(res, data, null);
                info("Vessel dashboard last five marinem data fetch api ends");
            } catch (err) {
                ErrorLog(`Vessel dashboard last five marinem data fetch api error block : ${err.message}`);
                helper.callback(res, null, err.message);  
            }
        });
    });

    return router
}