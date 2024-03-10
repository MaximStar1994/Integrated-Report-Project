const express = require("express");
const router = express.Router();
const helper = require('../helper/helper');
const config = require('../config/config')
const analyticsApi = require('../api/analyticsApi');
var moment = require('moment');
const { info, err: ErrorLog } = require("../common/log");

module.exports = function(api) {
  
    //Analytics
    router.post("/tag/trend", async (req, res) => {
        info("Tag trend api starts");
        var projname = "B357"
        if (req.body.projname !== undefined) {
        projname = req.body.projname
        }
        var startDT = req.body.startdate || new Date()
        var endDT = req.body.enddate || new Date()
        var vesselID = req.body.vesselId || ""
        var tagnames = req.body.tagnames || ""
        var tagIdentifier = req.body.tagIdentifier || ""
           
        let rtnObj = await analyticsApi.GetTagTrend(vesselID,startDT, endDT,tagnames,tagIdentifier)
        helper.callback(res, rtnObj, null);
        info("Tag trend api ends");
    })
    
    

    router.post("/tags/all", async (req, res) => {
        info("All tags api starts");
        var vesselID = req.body.vesselId;
        try{
            let rtnObj = await analyticsApi.GetAllTags(vesselID);
            helper.callback(res, rtnObj, null);
            info("All tags api ends");
        } catch (err) {
            ErrorLog(`All tags api error block : ${err.message}`);
            helper.callback(res, null,err)
        }
    })
    return router
}