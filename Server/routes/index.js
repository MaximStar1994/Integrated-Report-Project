const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const fileType = require("file-type");
const multiparty = require("multiparty");
const { uuid } = require("uuidv4");
const api = require("../api.js");
const helper = require("../helper/helper");
const { info, err: ErrorLog } = require("../common/log");


module.exports = function () {
  router.get("/", (req, res) => {
    res.send({ response: "I am alive" }).status(200);
  });
  router.post("/file/pdf/upload", (req, res) => {
    info("Pdf upload api starts");
    const form = new multiparty.Form();
    helper.authorize(res, req, () => {
      form.parse(req, async (error, fields, files) => {
        if (error) {
          res.send({ success: false, error: error });
          return;
        }
        const filepath = files.file[0].path;
        const fileName = files.file[0].originalFilename;
        try {
          const buffer = fs.readFileSync(filepath);
          const type = await fileType.fromBuffer(buffer);
          const validImageTypes = ["application/pdf"];
          if (!validImageTypes.includes(type.mime)) {
            ErrorLog("Pdf upload api error block : file uploaded is not a pdf");
            return res
              .send({ success: false, error: "file uploaded is not a pdf" })
              .status(400);
          }
          const reportDir = "report";
          const relativeDir = uuid();
          const dirPath = path.join("public", reportDir, relativeDir);
          fs.mkdirSync(dirPath, { recursive: true });
          fs.writeFileSync(path.join(dirPath, fileName), buffer);
          fs.unlink(filepath, () => {});
          return res.send({
            success: true,
            response: `/public/report/${relativeDir}`,
          });
        } catch (error) {
          fs.unlink(filepath, () => {});
          return res.send({ success: false, error: error }).status(500);
        }
      });
    });
  });
  // ACCESS CONTROL
  router.post("/login", async (req, res) => {
    info("Login api starts");
    var username = req.body.username;
    var password = req.body.password;
    if (helper.IsEmpty(username) || helper.IsEmpty(password)) {
      ErrorLog("Login api error block : Invalid Credentials");
      helper.packageResponse(res, null, "Invalid Credentials");
      return;
    }
    try {
      let result = await api.Login(username, password);
      var token = result.token;
      res.cookie("jwtToken", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        signed: true,
      });
      helper.packageResponse(res, result, null);
      info("Login api ends");
    } catch (err) {
      ErrorLog(`Login api error block : ${err.message}`);
      helper.packageResponse(res, null, err.message);
    }
  });
  router.post("/token/verify", (req, res) => {
    info("Token verify api starts");
    helper.authorize(res, req, (decoded) => {
      helper.packageResponse(res, decoded, null);
    });
  });
  router.get("/user/apps", (req, res) => {
    info("User apps api starts");
    helper.authorize(res, req, async (user) => {
      try {
        let apps = await api.GetApps(user.accountId);
        helper.packageResponse(res, apps, null);
        info("User apps api ends");
      } catch (err) {
        ErrorLog(`User apps api error block : ${err.message}`);
        helper.packageResponse(res, null, err);
      }
    });
  });
  router.get("/vesselandapplist", (req, res) => {
    info("Vessel and apps list api starts");
    helper.authorize(res, req, async (user) => {
      try {
        let apps = await api.GetVesselAndAppsList();
        helper.packageResponse(res, apps, null);
        info("Vessel and apps list api ends");
      } catch (err) {
        ErrorLog(`Vessel and apps list api error block : ${err.message}`);
        helper.packageResponse(res, null, err);
      }
    });
  });
  router.post("/unlockapp", (req, res) => {
    info("Unlock app api starts");
    var page = req.body.page;
    var vessel_id = req.body.vessel_id;
    var crew_id = req.body.crew_id;
    helper.authorize(res, req, async (user) => {
      try {
        let result = await api.UnlockApp(page, vessel_id, crew_id);
        helper.packageResponse(res, result, null);
        info("Unlock app api ends");
      } catch (err) {
        ErrorLog(`Unlock app api error block : ${err.message}`);
        helper.packageResponse(res, null, err);
      }
    });
  });
  router.get("/getchats", (req, res) => {
    info("Get chats api starts");
    helper.authorize(res, req, async (user) => {
      try {
        let result = await api.GetChats();
        helper.packageResponse(res, result, null);
        info("Get chats api ends");
      } catch (err) {
        ErrorLog(`Get chats api error block : ${err.message}`);
        helper.packageResponse(res, null, err);
      }
    });
  });
  router.get("/getuserlist", (req, res) => {
    info("Get user list api starts");
    helper.authorize(res, req, async (user) => {
      try {
        let result = await api.GetUserList();
        helper.packageResponse(res, result, null);
        info("Get user list api ends");
      } catch (err) {
        ErrorLog(`Get user list api error block : ${err.message}`);
        helper.packageResponse(res, null, err);
      }
    });
  });
  router.get("/getuserdata", (req, res) => {
    info("Get user data api starts");
    let userID = req.query.userID;
    helper.authorize(res, req, async (user) => {
      try {
        let result = await api.GetUserData(userID);
        helper.packageResponse(res, result, null);
        info("Get user data api ends");
      } catch (err) {
        ErrorLog(`Get user data api error block : ${err.message}`);
        helper.packageResponse(res, null, err);
      }
    });
  });
  router.get("/getapps", (req, res) => {
    info("Get apps api starts");
    helper.authorize(res, req, async (user) => {
      try {
        let result = await api.GetAvailableApps();
        helper.packageResponse(res, result, null);
        info("Get chats api ends");
      } catch (err) {
        ErrorLog(`Get chats api error block : ${err.message}`);
        helper.packageResponse(res, null, err);
      }
    });
  });
  router.get("/getvesselslist", (req, res) => {
    info("Get vessel list api starts");
    helper.authorize(res, req, async (user) => {
      try {
        let result = await api.GetVesselsList();
        helper.packageResponse(res, result, null);
        info("Get vessel list api ends");
      } catch (err) {
        ErrorLog(`Get vessel list api error block : ${err.message}`);
        helper.packageResponse(res, null, err);
      }
    });
  });
  router.post("/signup", async (req, res) => {
    info("Signup api starts");
    var username = req.body.username;
    var name = req.body.name;
    var password = req.body.password;
    var vesselId = req.body.vesselId;
    var accountType = req.body.accountType;
    var chats = req.body.chats;
    var apps = req.body.apps;
    if (
      helper.IsEmpty(username) ||
      helper.IsEmpty(name) ||
      helper.IsEmpty(password) ||
      helper.IsEmpty(accountType)
    ) {
      ErrorLog("Signup api error block : Invalid Credentials");
      helper.callback(res, null, "Invalid Credentials");
      return;
    }
    try {
      let signupResult = await api.SignUp(
        username,
        name,
        password,
        vesselId,
        accountType,
        chats,
        apps
      );
      helper.packageResponse(res, signupResult, null);
      info("Signup api ends");
    } catch (err) {
      ErrorLog(`Signup api error block : ${err.message}`);
      helper.packageResponse(res, null, err);
    }
  });
  router.post("/updateuser", async (req, res) => {
    info("Update User api starts");
    var username = req.body.username;
    var name = req.body.name;
    var vesselId = req.body.vesselId;
    var accountType = req.body.accountType;
    var chats = req.body.chats;
    var apps = req.body.apps;
    if (
      helper.IsEmpty(username) ||
      helper.IsEmpty(name) ||
      helper.IsEmpty(accountType)
    ) {
      ErrorLog("Update User api error block : Invalid Credentials");
      helper.callback(res, null, "Invalid Credentials");
      return;
    }
    try {
      let signupResult = await api.UpdateUser(
        username,
        name,
        vesselId,
        accountType,
        chats,
        apps
      );
      helper.packageResponse(res, signupResult, null);
      info("Update User api ends");
    } catch (err) {
      ErrorLog(`Update User api error block : ${err.message}`);
      helper.packageResponse(res, null, err);
    }
  });

  router.post("/unlockapp-browser-tab-close", (req, res) => {
    info("Unlock app browser-tab-close api starts");
    var vessel_id = req.body.vessel_id;
    var accountType = req.body.accountType;
    var currentUser = req.body.currentUser;
    helper.authorize(res, req, async (user) => {
      try {
        let result = await api.UnlockAppBrowserTabClose(vessel_id,accountType,currentUser);
        helper.packageResponse(res, result, null);
        info("Unlock app browser-tab-close api ends");
      } catch (err) {
        ErrorLog(`Unlock app browser-tab-close api error block : ${err.message}`);
        helper.packageResponse(res, null, err);
      }
    });
  });

  return router;
};
