const express = require("express");
const router = express.Router();
const helper = require('../helper/helper');
const healthCheckApi = require('../api/healthCheckApi');
const config = require('../config/config');
const { info, err: ErrorLog } = require("../common/log");

module.exports = function(api) {
    router.get("/gethealth", async (req, res) => {
        info("Get health api starts");
        try{
            const result = await healthCheckApi.HealthCheck();
            helper.callback(res, result, null);
            info("Get health api ends");
        }
        catch (err) {
            ErrorLog(`Get health api error block : ${err.message}`);
            helper.callback(res, null, err);
        }
    })
    return router
}