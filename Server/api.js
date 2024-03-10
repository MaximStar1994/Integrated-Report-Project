const ServiceManager = require('./services/ServiceManager.js')
"use strict";
class API {
    constructor () {
        this.serviceManager = new ServiceManager()
    }
    async VerifyJWT(req,res) {
        let token = req.signedCookies['jwtToken']
        if (token == undefined) {
            token = req.headers['x-access-token'] || req.headers['authorization'];
            if (token.startsWith('Bearer ')) {
                token = token.slice(7, token.length);
            }
        }
        if (token) {
            // if (process.env.NODE_ENV == 'prod') {
            //     res.cookie('jwtToken',token,{ maxAge: 24 * 60 * 60 * 1000, httpOnly: true, signed : true})
            // } else if (process.env.NODE_ENV == 'staging') {
            //     res.cookie('jwtToken',token,{ maxAge: 24 * 60 * 60 * 1000, secure : true, sameSite : "None", signed : true})
            // } else {
            //     res.cookie('jwtToken',token,{ maxAge: 24 * 60 * 60 * 1000, signed : true})
            // }
           let tokeninfo = await this.serviceManager.GetUserAccountApi().VerifyToken(token)
           let userinfo = await this.serviceManager.GetUserAccountApi().GetUserInfo(tokeninfo.accountId)
           userinfo.token = await this.serviceManager.GetUserAccountApi().GenerateToken(userinfo)
           await res.cookie('jwtToken',userinfo.token,{ maxAge: 24 * 60 * 60 * 1000, httpOnly: true, signed : true})
           return userinfo
        } else {
            throw new Error('Auth Token is missing')
        }
    }
    async Login(username, password) {
        return this.serviceManager.GetUserAccountApi().Login(username,password)
    }
    async GetChats() {
        return this.serviceManager.GetUserAccountApi().GetChats()
    }
    async GetUserList() {
        return this.serviceManager.GetUserAccountApi().GetUserList()
    }
    async GetUserData(userID) {
        return this.serviceManager.GetUserAccountApi().GetUserData(userID)
    }
    async GetAvailableApps() {
        return this.serviceManager.GetUserAccountApi().GetAvailableApps()
    }
    async GetVesselsList() {
        return this.serviceManager.GetUserAccountApi().GetVesselsList()
    }
    async SignUp(username, name, password, vesselId, accountType, chats, apps) {
        return this.serviceManager.GetUserAccountApi().SignUp(username, name, password, vesselId, accountType, chats, apps)
    }
    async UpdateUser(username, name, vesselId, accountType, chats, apps) {
        return this.serviceManager.GetUserAccountApi().UpdateUser(username, name, vesselId, accountType, chats, apps)
    }
    async SetSuperAdmin(accountId) {
        return this.serviceManager.GetUserAccountApi().SetSuperAdmin(accountId)
    }
    async SetAdmin(accountId) {
        return this.serviceManager.GetUserAccountApi().SetAdmin(accountId)
    }
    RegenToken(decoded) {
        delete decoded.exp
        delete decoded.iat
        return this.serviceManager.GetUserAccountApi().GenerateToken(decoded)
    }
    async GetApps(accountId) {
        return this.serviceManager.GetUserAccountApi().GetRegisteredApps(accountId)
    }
    async GetVesselAndAppsList() {
        return this.serviceManager.GetUserAccountApi().GetVesselAndAppsList();
    }
    async UnlockApp(page, vessel_id, crew_id) {
        return this.serviceManager.GetUserAccountApi().UnlockApp(page, vessel_id, crew_id)
    }
    async UnlockAppBrowserTabClose(vessel_id,accountType,currentUser) {
        return this.serviceManager.GetUserAccountApi().UnlockAppBrowserTabClose(vessel_id,accountType,currentUser)
    }
}
module.exports = new API();