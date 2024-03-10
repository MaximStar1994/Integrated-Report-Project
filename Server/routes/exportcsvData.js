const express = require("express");
const router = express.Router();
const helper = require('../helper/helper');
const exportCSV = require('../api/exportCSVApi');
const config = require('../config/config');
const { info, err: ErrorLog } = require("../common/log");

module.exports = function(api) {
    router.get("/exportcsv/data", async (req, res) => {
        info("Export csv data fetch starts");
        var today = req.query.today;
        try{
            let data = await exportCSV.GetData(today);
            helper.callback(res, data, null);
            info("Export csv data fetch ends");
        } catch (err) {
            ErrorLog(`Export csv data fetch error block : ${err.message}`);
            helper.callback(res, null,err)
        }
    })
    router.get("/exportcsv/vesselreportdata", async (req, res) => {
        info("Export csv vessel report data fetch starts");
        var startDate = req.query.startDate;
        var endDate = req.query.endDate;
        var vesselId = req.query.vesselId;
        try{
            let vesselReportData = await exportCSV.GetVesselReportData(startDate, endDate, vesselId);
            let dailyLogData = await exportCSV.GetDailyLogData(startDate, endDate, vesselId);
            helper.callback(res, { vesselReport: vesselReportData, dailyLog: dailyLogData }, null)
            info("Export csv vessel report data fetch ends");
        } catch (err) {
            ErrorLog(`Export csv vessel report data fetch error block : ${err.message}`);
            helper.callback(res, null,err)
        }
    })
    router.get("/exportcsv/forhdata", async (req, res) => {
        info("Export csv forh data fetch starts");
        var startDate = req.query.startDate;
        var endDate = req.query.endDate;
        var vesselId = req.query.vesselId;
        try{
            let data = await exportCSV.GetFORHData(startDate, endDate, vesselId);
            helper.callback(res, data, null)
            info("Export csv forh data fetch ends");
        } catch (err) {
            ErrorLog(`Export csv forh data fetch error block : ${err.message}`);
            helper.callback(res, null,err)
        }
    })
    router.get("/exportcsv/missinglogs", async (req, res) => {
        info("Export csv missing logs fetch starts");
        helper.authorize(res,req, async(user)=>{
            var startDate = req.query.startDate;
            var endDate = req.query.endDate;
            try{
                let data = await exportCSV.GetMissingLogs(startDate, endDate);
                helper.callback(res, data, null)
                info("Export csv missing logs fetch ends");
            } catch (err) {
                ErrorLog(`Export csv missing logs fetch error block : ${err.message}`);
                helper.callback(res, null,err)
            }
        })
    })
    return router
}