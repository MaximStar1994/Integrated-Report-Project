const express = require("express");
const router = express.Router();
const helper = require("../helper/helper");
const vesselReportApi = require("../api/vesselReportApi");
// const vesselReportApi = new VesselReportApi()
const config = require("../config/config");
const { info, err: ErrorLog } = require("../common/log");
const dailyLogApi = require("../api/dailyLogApi");

module.exports = function (api) {
  // router.get("/vesselreport", (req,res) => {
  //     vesselReportApi.GetEngineLogForToday((val,err) => {
  //         helper.callback(res,val,err)
  //     })
  // })
  // router.get("/vesselreport/data", (req,res) => {
  //     vesselReportApi.GetEngineLogData((val,err) => {
  //         helper.callback(res,val,err)
  //     })
  // })
  // router.get("/vesselreport/list/edge", (req,res) => {
  //     vesselReportApi.ListEngineLogsOffline((val,err) => {
  //         helper.callback(res,val,err)
  //     })
  // })
  router.get("/vesselreport/list", async (req, res) => {
    info("Vessel report list fetch starts");
    var vesselID = req.query.vesselID;
    try {
      const list = await vesselReportApi.ListVesselReports(vesselID);
      helper.callback(res, list, null);
      info("Vessel report list fetch ends");
    } catch (err) {
      ErrorLog(`Vessel report list fetch error block : ${err.message}`);
      helper.callback(res, null, err);
    }
  });

  router.post("/vesselreport/sync", async (req, res) => {
    info("Vessel report save starts");
    var vesselReports = req.body.logs;
    helper.authorize(res, req, async (user) => {
      try {
        const value = await vesselReportApi.SyncVesselReports(
          user,
          vesselReports
        );
        // await vesselReportApi.GenerateVesselReportForOldLogs();
        helper.callback(res, value, null);
        info("Vessel report save ends");
      } catch (err) {
        ErrorLog(`Vessel report save error block : ${err.message}`);
        helper.callback(res, null, err);
      }

      // if (user.apps instanceof Array && user.apps.includes(config.fuellngConfig.apps.OPERATION)) {
      // vesselReportApi.GenerateElogForOld(()=>{
      //     helper.callback(res,val,err)
      // })
      // } else {
      //     helper.callback(res,null,"User unauthorized to perform this operation")
      // }
    });
  });

  router.get("/vesselreport/pdf-generation",async(req,res) => {
      info("Vessel report PDF generation starts");
      helper.authorize(res,req,async(user) => {
      try {
        await vesselReportApi.GenerateVesselReportForOldLogs();
        helper.callback(res,true,null);
        info("Vessel report PDF generation ends");
      } catch (error) {
        ErrorLog(`Vessel report PDF generation error block : ${err.message}`);
        helper.callback(res, null, err);
      }
    });     
  });

  router.post("/vesselreport/generatereportforoldlogs", async (req, res) => {
    info("Vessel report Old report pdf generation starts");
    helper.authorize(res, req, async (user) => {
      try {
        await vesselReportApi.GenerateVesselReportForOldLogs();
        helper.callback(res, "Old Reports Generated!", null);
        info("Vessel report Old report pdf generation ends");
      } catch (err) {
        ErrorLog(`Vessel report Old Reports generation error block : ${err.message}`);
        helper.callback(res, null, err);
      }
    });
  });
  router.post("/vesselreport/available", async (req, res) => {
    info("Vessel report available starts");
    var userLock = req.body.lock;
    var vesselID = req.body.vesselID;
    var accountType = req.body.accountType;
    try {
      var canView = true;
      if (accountType !== "vessel") {
        canView = await vesselReportApi.CanViewVesselReportPage(userLock,vesselID);
      }
      if (canView === true) {
        const lock = await vesselReportApi.LockVesselReportPage(userLock,vesselID,accountType);
        helper.callback(res, lock, null);
      } else {
        helper.callback(res, null, "Another Device using the page now!");
      }
      info("Vessel report available ends");
    } catch (err) {
      ErrorLog(`Vessel report available error block : ${err.message}`);
      helper.callback(res, null, err);
    }
  });
  /*
    lock : String
    */
  router.post("/vesselreport/unlock", async (req, res) => {
    info("Vessel report unlock starts");
    var userLock = req.body.lock;
    var vesselID = req.body.vesselID;
    try {
      const unlock = await vesselReportApi.UnlockVesselReportPage(
        userLock,
        vesselID
      );
      helper.callback(res, unlock, null);
      info("Vessel report unlock ends");
    } catch (err) {
      ErrorLog(`Vessel report available unlock error block : ${err.message}`);
      helper.callback(res, null, err);
    }
  });
  router.get("/vesselreport/structure", async (req, res) => {
    info("Vessel report structure starts");
    var vesselID = req.query.vesselID;
    try {
      const vessel = await vesselReportApi.GetVessel(vesselID);
      const generators = await vesselReportApi.GetGeneratorStructure(vesselID);
      const crews = await vesselReportApi.GetCrewData(vesselID);
      let LNGProperties = false;
      if (vesselID === "10" || vesselID === "11") {
        LNGProperties = true;
      }
      helper.callback(
        res,
        {
          generators: generators,
          crews: crews,
          vessel: vessel,
          LNGProperties: LNGProperties,
        },
        null
      );
      info("Vessel report structure ends");
    } catch (err) {
      ErrorLog(`Vessel report structure error block : ${err.message}`);
      helper.callback(res, null, err);
    }
  });

  router.post("/vesselreport/authorized-backdated/save", async (req, res) => {
    info("Authorized backdated save starts");
    helper.authorize(res, req, async (user) => {
      try {
        var authorizedBackDatedData = [];
        authorizedBackDatedData = req.body.saveArray;
        if (authorizedBackDatedData.length === 0) {
          throw new Error("Please enter data");
        }
        const value = await vesselReportApi.saveAuthorizedBackDatedData( authorizedBackDatedData, user );
        helper.callback(res, value, null);
        info("Authorized backdated save ends");
      } catch (err) {
        ErrorLog(`Authorized backdated save error block : ${err.message}`);
        helper.callback(res, null, err.message);
      }
    });
  });

  router.get("/vesselreport/authorized-backdated/list", async (req, res) => {
    info("Authorized backdated list fetch starts");
    helper.authorize(res, req, async (user) => {
      try {
        const value = await vesselReportApi.fetchAuthorizedBackDatedData();
        helper.callback(res, value, null);
        info("Authorized backdated list fetch ends");
     
    } catch (err) {
      ErrorLog(`Authorized backdated list fetch error block : ${err.message}`);
      helper.callback(res, null, err.message);
    }
  });
  });

  router.delete("/vesselreport/authorized-backdated/delete", async (req, res) => {
    info("Authorized backdated delete starts");
      try {
        helper.authorize(res, req, async (user) => {
          var backDatedId = parseInt(req.query.id);
          if (!helper.IsEmpty(backDatedId)) {
            const value = await vesselReportApi.deleteAuthorizedBackDatedDataById( backDatedId );
            helper.callback(res, value, null);
            info("Authorized backdated delete ends");
          }
        });
      } catch (err) {
        ErrorLog(`Authorized backdated delete error block : ${err.message}`);
        helper.callback(res, null, err.message);
      }
    }
  );

  router.post("/vesselreport/authorized-backdated/check", async (req, res) => {
    info("Authorized backdated check starts");
    helper.authorize(res, req, async (user) => {
      try {
        var authorizedBackDatedData = [];
        authorizedBackDatedData = req.body.saveArray;
        if (authorizedBackDatedData.length === 0) {
          throw new Error("Please enter data");
        }
        const value = await vesselReportApi.checkAuthorizedBackDatedData( authorizedBackDatedData );
        helper.callback(res, value, null);
        info("Authorized backdated check ends");
      } catch (err) {
        ErrorLog(`Authorized backdated check error block : ${err.message}`);
        helper.callback(res, null, err.message);
      }
    });
  });

  router.get("/vesselreport/authorized-backdated/isAvailable", async (req, res) => {
    info("Authorized backdated isAvailable starts");
      try {
        helper.authorize(res, req, async (user) => {
          var vesselId = parseInt(req.query.id);
          if (!helper.IsEmpty(vesselId)) {
            const value = await vesselReportApi.isAuthorizedBackDatedDataAvailable( vesselId );
            helper.callback(res, value, null);
            info("Authorized backdated isAvailable ends");
          }
        });
      } catch (err) {
        ErrorLog(`Authorized backdated isAvailable error block : ${err.message}`);
        helper.callback(res, null, err.message);
      }
    }
  );

  router.get("/vesselreport/authorized-backdated/complete", async (req, res) => {
    info("Authorized backdated complete starts");
      try {
        helper.authorize(res, req, async (user) => {
          var queryParam = req.query;
          const value = await vesselReportApi.isAuthorizedBackDatedDataComplete( queryParam );
          helper.callback(res, value, null);
          info("Authorized backdated complete ends");
        });
      } catch (err) {
        ErrorLog(`Authorized backdated complete error block : ${err.message}`);
        helper.callback(res, null, err.message);
      }
    }
  );

  router.get("/vesselreport/authorized-backdated/shift-details-by-report-date", async (req, res) => {
    info("Authorized backdated shift details fetch by report date starts");
    try {
      helper.authorize(res, req, async (user) => {
        var vesselId = parseInt(req.query.vesselId);
        var reportDate = req.query.reportDate;
        if (helper.IsEmpty(vesselId) || helper.IsEmpty(reportDate)) {
          throw new Error("Something went wrong!");
        }
        const value = await vesselReportApi.fetchShiftBackDatedDataByReportDate(vesselId,reportDate);
        helper.callback(res, value, null);
        info("Authorized backdated shift details fetch by report date ends");
      });
    } catch (err) {
      ErrorLog(`Authorized backdated shift details fetch by report date error block : ${err.message}`);
      helper.callback(res, null, err.message);
    }
  }
  );

  router.get("/vesselreport/export-vr-form-structure/list", async (req, res) => {
    info("Export daily log form structure fetch starts");
    helper.authorize(res, req, async (user) => {
      try {
        var vesselId = parseInt(req.query.vesselId);
        const value = await vesselReportApi.getVesselReportFormStructure(vesselId,dailyLogApi);
        helper.callback(res,value, null);
        info("Export daily log form structure fetch ends");
     
    } catch (err) {
      ErrorLog(`Export daily log form structure fetch error block : ${err.message}`);
      helper.callback(res, null, err.message);
    }
  });
  });

  router.get("/vesselreport/export-shift-log-form-structure/list", async (req, res) => {
    info("Export vessel report shift log form structure fetch starts");
    helper.authorize(res, req, async (user) => {
      try {
        var vesselId = parseInt(req.query.vesselId);
        const SHIFT = req.query.shift;
        const value = await vesselReportApi.getVesselReportShiftLogFormStructure(vesselId,SHIFT);
        helper.callback(res,value, null);
        info("Export vessel report shift log form structure fetch ends");
      } catch (err) {
        ErrorLog(`Export vessel report shift log form structure fetch error block : ${err.message}`);
        helper.callback(res, null, err.message);
      }
    });
  });

  router.get("/vesselreport-dailylog/get-previous-date-missing-submission",async (req,res) => {
    helper.authorize(res, req, async (user) => {
      try {
        info("VesselReport/DailyLog previous date missing submission fetch starts");
        const REPORTDATE = req.query.reportDate;
        if(helper.IsEmpty(REPORTDATE)) {
          throw new Error("Report cannot be empty");
        }
        const value = await vesselReportApi.getPreviousDateMissingSubmissionVRFDLData(REPORTDATE);
        helper.callback(res,value,null);
        info("VesselReport/DailyLog previous date missing submission fetch ends");
      } catch (error) {
          ErrorLog(`VesselReport/DailyLog previous date missing submission error block : ${error.message}`);
          helper.callback(res, null, error.message);
      }
    });
  })

  return router;
};
