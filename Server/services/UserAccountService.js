const { uuid } = require('uuidv4');
const crypto = require("crypto");
const jwt  = require('jsonwebtoken');
const config = require('../config/config.js')
"use strict";
const SECRET  = config.secretJWT
const SECRETPW  = config.secretPW
const { interfaceObj } = require("./interfaces/PostGreSQLInterface");
const vesselsPageList = ['VESSELREPORT', 'DAILYLOG', 'CREWTEMPERATURELOG', 'VESSELDISINFECTION', 'VESSELBREAKDOWN'];
const managementPageList = ['CREWPLANNING'];
class UserAccountService {
    constructor () {
        this.sqlInterface = interfaceObj
        this.config = config.kstConfig
        this.sqlInterface.config = config.kstConfig.dbConfig
    }
    async GetUser(username, callback) {
        if (typeof(username) != "string" ) {
            callback (null)
        }
        let userrows = await this.sqlInterface.PerformQueryPromise(`
        SELECT * 
        FROM ${this.config.sqlTables.USERACCOUNT} WHERE 
        username=$1`,[username])
        if (userrows.length == 0) {
            return null
        } else {
            return userrows[0]
        }
    }
    async GetSaltAndPw(username) {
        if (typeof(username) != "string" ) {
            throw new Error("Invalid username submitted")
        }
        let userrows = []
        try{
            userrows = await this.sqlInterface.PerformQueryPromise(`
            SELECT salt, password, account_id 
            FROM ${this.config.sqlTables.USERACCOUNT} WHERE 
            username=$1`,[username])
        }catch(err){
            console.log(err)
            throw new Error("Internal Server Error, Please contact VesselCare Support.");
        }
        if (userrows.length == 0) {
            throw new Error("No such user found!")
        } else {
            return userrows[0]
        }
    }
    async GetRegisteredApps(accountId) {
        return await this.sqlInterface.PerformQueryPromise(
        `SELECT module, app 
        FROM ${config.kstConfig.sqlTables.USERACCOUNTAPP} 
        WHERE account_id=$1`,
        [accountId])
    }

    async GetVesselAndAppsList() {
        let result = {vessels: [], apps: []}
        result.vessels = await this.sqlInterface.PerformQueryPromise(`
        SELECT vessel_id, name
        FROM ${config.kstConfig.sqlTables.VESSEL} ORDER BY vessel_id
        `,[]);
        result.apps = await this.sqlInterface.PerformQueryPromise(
        `SELECT DISTINCT page FROM ${config.kstConfig.sqlTables.LOCK}`,
        []);
        let temp = [];
        result.apps.forEach(element=> temp.push(element.page));
        result.apps = temp;
        return result;
    }

    async UnlockApp(page, vessel_id, crew_id) {
        let query = `UPDATE ${config.kstConfig.sqlTables.LOCK} SET (pagelock, currentuser) = (NULL, NULL) `;
        if(page!=='' || vessel_id!== '' || crew_id!==''){
            query += 'WHERE '
        }
        if(page!==''){
            query += `page = \'${page}\' `
            if(vessel_id!==''){
                query += 'AND '
            }
        }
        if(vessel_id!==''){
            query += `vessel_id=${vessel_id} `
            if(crew_id!==''){
                query += 'AND '
            }
        }
        if(crew_id!==''){
            query += `crew_id=${crew_id}`
        }
        await this.sqlInterface.PerformQueryPromise(query, []);
        return true;
    }
    
    async GetUserInfo(accountId) {
        let rows = await this.sqlInterface.PerformQueryPromise(`
        SELECT 
            uf.vessel_id, f.name AS vessel_name, u.account_id, u.username, u.account_type, u.name
        FROM ${config.kstConfig.sqlTables.USERACCOUNT} AS u 
        LEFT JOIN ${config.kstConfig.sqlTables.USERACCOUNTVESSEL} AS uf ON uf.account_id = u.account_id
        LEFT JOIN ${config.kstConfig.sqlTables.VESSEL} AS f ON f.vessel_id = uf.vessel_id
        WHERE u.account_id=$1
        `,[accountId])
        let vesselList = await this.sqlInterface.PerformQueryPromise(`
            SELECT vessel_id, name from ${config.kstConfig.sqlTables.VESSEL} ORDER BY vessel_id
        `, []);
        let accountApps = await this.sqlInterface.PerformQueryPromise(`
            SELECT app from ${config.kstConfig.sqlTables.USERACCOUNTAPP} WHERE account_id=$1
        `, [accountId]);
        
        var userinfo = {
            accountId : accountId,
            username : rows[0].username,
            accountType : rows[0].account_type,
            name: rows[0].name,
            vessels : rows.filter(row => row.vessel_id != null).map(row => {
                return {
                    name : row.vessel_name,
                    vesselId : row.vessel_id
                }
            }),
            vesselList: vesselList,
            apps: [],
            accountApps: accountApps
        }
        rows = await this.GetRegisteredApps(accountId)
        userinfo.apps = rows.filter(row=>row.app != null).map(row => {return row.app})
        userinfo.apps = [...new Set(userinfo.apps)]
        userinfo.modules = rows.filter(row => row.module != null).map(row => {return row.module})
        userinfo.modules = [...new Set(userinfo.modules)]
        return userinfo
    }
    
    GenerateToken(userinfo) {
        userinfo.signer = 'KSTVesselcare'
        var token = jwt.sign(userinfo, SECRET, { expiresIn: '7d' });
        return token
    }

    // API functions
    async GetChats() {
        let chats = await this.sqlInterface.PerformQueryPromise(`
        SELECT * FROM ${this.config.sqlTables.CHATS} ORDER BY chat_id`,[])
        return chats;
    }
    async GetAvailableApps() {
        let apps = await this.sqlInterface.PerformQueryPromise(`
        SELECT * FROM ${this.config.sqlTables.AVAILABLEAPPS} ORDER BY app`,[])
        return apps;
    }

    async GetVesselsList() {
        let vesselsList = await this.sqlInterface.PerformQueryPromise(`
        SELECT vessel_id, name FROM ${this.config.sqlTables.VESSEL} ORDER BY vessel_id`,[])
        return vesselsList;
    }
    async GetUserList() {
        let userList = await this.sqlInterface.PerformQueryPromise(`
        SELECT username FROM ${this.config.sqlTables.USERACCOUNT} ORDER BY username`,[])
        let temp = [];
        userList.forEach(element=>temp.push(element.username));
        return temp;
    }
    async GetUserData(userID) {
        let userData = await this.sqlInterface.PerformQueryPromise(`
        SELECT u.account_id, u.username, u.name, u.account_type, u.name, v.vessel_id, vessel.name AS vessel_name FROM ${this.config.sqlTables.USERACCOUNT} u
        LEFT JOIN ${this.config.sqlTables.USERACCOUNTVESSEL} v ON u.account_id=v.account_id 
        LEFT JOIN ${this.config.sqlTables.VESSEL} ON v.vessel_id=vessel.vessel_id where u.username=$1`,[userID])
        if(userData instanceof Array && userData.length>0){
            let account_id = userData[0].account_id;
            let chatList = await this.sqlInterface.PerformQueryPromise(`
            SELECT m.chat_id, c.chat_name, c.chat_type FROM ${this.config.sqlTables.CHATMEMBERS} m LEFT JOIN ${this.config.sqlTables.CHATS} c ON m.chat_id=c.chat_id WHERE member_id=${account_id}`, [])
            let appList = await this.sqlInterface.PerformQueryPromise(`
            SELECT module, app FROM ${this.config.sqlTables.USERACCOUNTAPP} WHERE account_id=${account_id}`, [])
            userData = userData[0];
            userData.chats = [...chatList]
            userData.apps = [...appList]
        }
        return userData;
    }

    async SignUp(username, name, password, vesselId, accountType, chats, apps) {
        const hmac = crypto.createHmac('sha256', SECRETPW);
        var salt = uuid().split("-")[0]
        hmac.update(password + salt);
        const hashed =  hmac.digest('hex');
        let user = await this.GetUser(username)
        if (user != null) {
            throw new Error("User already exist")
        } 
        let accountId = await this.sqlInterface.PerformInsertPromise(config.kstConfig.sqlTables.USERACCOUNT, {
            username : username,
            name: name,
            password : hashed,
            salt : salt,
            account_type : accountType
        },"account_id")
        accountId = accountId.account_id
        if (vesselId != null) {
            await this.sqlInterface.PerformInsertPromise(config.kstConfig.sqlTables.USERACCOUNTVESSEL, {
                account_id : accountId,
                vessel_id : vesselId,
            },"*")
        }
        if(chats instanceof Array && chats.length>0){
            chats.forEach(async e=>{
                await this.sqlInterface.PerformInsertPromise(config.kstConfig.sqlTables.CHATMEMBERS, {
                    chat_id : e,
                    member_id : accountId,
                    member_name : name,
                },"*")
            })
        }
        if(apps instanceof Array && apps.length>0){
            let selectedApps = await this.sqlInterface.PerformQueryPromise(`
            SELECT * FROM ${this.config.sqlTables.AVAILABLEAPPS} ORDER BY app`,[])
            selectedApps = selectedApps.filter(e=>{
                return apps.includes(e.app)
            })
            selectedApps.forEach(async e=>{
                await this.sqlInterface.PerformInsertPromise(config.kstConfig.sqlTables.USERACCOUNTAPP, {
                    account_id : accountId,
                    module : e.module,
                    app : e.app
                },"*")
            })
        }
        return this.Login(username, password)
    }

    async UpdateUser(username, name, vesselId, accountType, chats, apps) {
        let user = await this.GetUser(username)
        if (user == null) {
            throw new Error("User does not exist!")
        }
        let account_id = user.account_id;
        let result = await this.sqlInterface.PerformQueryPromise(`
            UPDATE ${config.kstConfig.sqlTables.USERACCOUNT} SET account_type=$1, name=$2 WHERE account_id=${account_id}
        `, [accountType, name])
        let accountVessels = await this.sqlInterface.PerformQueryPromise(`
            SELECT * FROM ${config.kstConfig.sqlTables.USERACCOUNTVESSEL} WHERE account_id=${account_id}
        `, [])
        if(accountVessels instanceof Array && accountVessels.length>0){
            result = await this.sqlInterface.PerformQueryPromise(`
                UPDATE ${config.kstConfig.sqlTables.USERACCOUNTVESSEL} SET vessel_id=$1 WHERE account_id=${account_id}
            `, [vesselId])
        }
        else{
            result = await this.sqlInterface.PerformQueryPromise(`
                INSERT INTO ${config.kstConfig.sqlTables.USERACCOUNTVESSEL} (account_id, vessel_id) VALUES (${account_id}, $1)
            `, [vesselId])
        }

        result = await this.sqlInterface.PerformQueryPromise(`
            DELETE FROM ${config.kstConfig.sqlTables.CHATMEMBERS} WHERE member_id=${account_id}
        `, [])
        if(chats instanceof Array && chats.length>0){
            chats.forEach(async e=>{
                await this.sqlInterface.PerformInsertPromise(config.kstConfig.sqlTables.CHATMEMBERS, {
                    chat_id : e,
                    member_id : account_id,
                    member_name : name,
                },"*")
            })
        }
        result = await this.sqlInterface.PerformQueryPromise(`
            DELETE FROM ${config.kstConfig.sqlTables.USERACCOUNTAPP} WHERE account_id=${account_id}
        `, [])
        if(apps instanceof Array && apps.length>0){
            let selectedApps = await this.sqlInterface.PerformQueryPromise(`
            SELECT * FROM ${this.config.sqlTables.AVAILABLEAPPS} ORDER BY app`,[])
            selectedApps = selectedApps.filter(e=>{
                return apps.includes(e.app)
            })
            selectedApps.forEach(async e=>{
                await this.sqlInterface.PerformInsertPromise(config.kstConfig.sqlTables.USERACCOUNTAPP, {
                    account_id : account_id,
                    module : e.module,
                    app : e.app
                },"*")
            })
        }
        return "User Updated!"
    }

    async SetSuperAdmin(accountId) {
        await Promise.all(
            [{module : "kst", app : "VESSELREPORTFORM"}].map(app => {
                return this.sqlInterface.PerformInsertPromise(config.kstConfig.sqlTables.USERACCOUNTAPP, {
                    module : app.module,
                    app : app.app,
                    account_id : accountId
                },"*")
            })
        )
        return true
    }
    async SetAdmin(accountId) {
        await Promise.all(
            [{module : "kst", app : "admin"}].map(app => {
                return this.sqlInterface.PerformInsertPromise(config.kstConfig.sqlTables.USERACCOUNTAPP, {
                    module : app.module,
                    app : app.app,
                    account_id : accountId
                },"*")
            })
        )
        return true
    }
    
    async Login(username, password) {
        const hmac = crypto.createHmac('sha256', SECRETPW);
        let usersaltpw = await this.GetSaltAndPw(username)
        if (usersaltpw != null) {
            hmac.update(password + usersaltpw.salt)
            const hashed =  hmac.digest('hex')
            if (usersaltpw.password === hashed) {
                let userinfo = await this.GetUserInfo(usersaltpw.account_id)
                userinfo.token = this.GenerateToken(userinfo)
                return userinfo
            } else {
                throw new Error("Invalid Password!")
            }
        } else {
            return null
        }
    }
    async VerifyToken(token) {
        return new Promise((resolve,reject) => {
            jwt.verify(token, SECRET, function(err, decoded) {
                if (err) {
                    reject(err)
                } else {
                    if (decoded.signer == "KSTVesselcare") {
                        resolve(decoded)
                    } else {
                        reject("Invalid Token")
                    }
                }
            })
        })
    }

    async UnlockAppBrowserTabClose(vessel_id, accountType,currentUser) {
        if (accountType === "vessel") {
            let query = `UPDATE ${config.kstConfig.sqlTables.LOCK} SET (pagelock, currentuser) = (NULL, NULL) WHERE 
                        page in ('${vesselsPageList[0]}','${vesselsPageList[1]}','${vesselsPageList[2]}','${vesselsPageList[3]}',
                        '${vesselsPageList[4]}') AND vessel_id=${vessel_id}`;
            await this.sqlInterface.PerformQueryPromise(query, []);
        } else if (accountType === "management" || accountType === "admin") {
            await this.sqlInterface.PerformQueryPromise(`
            UPDATE ${config.kstConfig.sqlTables.LOCK} SET (pagelock,currentuser) = (NULL,NULL)
            WHERE page='${managementPageList[0]}' AND currentuser='${currentUser}';
        `,[])
        }
        return true;
    }
}
module.exports = new UserAccountService();