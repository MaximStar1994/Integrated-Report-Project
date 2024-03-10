const express = require("express");
const router = express.Router();
const helper = require('../helper/helper');
const fleetDashboardApi = require('../api/fleetDashboardApi');
const { info, err: ErrorLog } = require("../common/log");

module.exports = function(api) {
    router.get("/fleetdashboard/getdata", async (req, res) => {
        info("fleet dashboard data fetch starts");
        var today = req.query.today;
        try {
            const data = await fleetDashboardApi.GetFleetDashboardData(today);
            helper.callback(res, data, null);
            info("fleet dashboard data fetch ends");
        }
        catch (err) {
            ErrorLog(`fleet dashboard data fetch error block : ${err.message}`);
            helper.callback(res, null, err);
        }
    });

    router.get("/fleetdashboard/get_last_five_marinem_data", async (req, res) => {
        info("fleet dashboard last five marinem data fetch api starts"); 
        helper.authorize(res, req, async (user) => {
            try {
                const data = await fleetDashboardApi.GetFleetDashboardLastFiveMarinemData();
                helper.callback(res, data, null);
                info("fleet dashboard last five marinem data fetch api ends");
            } catch (err) {
                ErrorLog(`fleet dashboard last five marinem data fetch api error block : ${err.message}`);
                helper.callback(res, null, err.message);  
            }
        });
    });

    return router
}