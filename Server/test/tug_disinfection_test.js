var assert = require('assert');
const {areSameRecord} = require('../helper/helper')
const common = require('./common')
const moment = require('moment')
const tugDisinfectionApi = require('../api/tugDisinfectionApi')
const {mappings} = require('../services/TugDisinfectionService')
const vessels = common.vessels

var vessel1adminuser = {
    username : "vessel1admin"
}
var vessel2adminuser = {
    username : "vessel2admin"
}


var disinfectionvessel1shift1 = JSON.parse(JSON.stringify(common.templates.tugDisinfection))
disinfectionvessel1shift1.vesselId = common.vessels[0].vesselId
disinfectionvessel1shift1.dateSubmitted = new Date(2021,1,1,0,0,0,0)
disinfectionvessel1shift1.timeSubmitted = "0530"

var disinfectionvessel1shift2 = JSON.parse(JSON.stringify(common.templates.tugDisinfection))
disinfectionvessel1shift2.vesselId = common.vessels[0].vesselId
disinfectionvessel1shift2.dateSubmitted = new Date(2021,1,1,0,0,0,0)
disinfectionvessel1shift2.timeSubmitted = "1730"

var disinfectionvessel2shift1 = JSON.parse(JSON.stringify(common.templates.tugDisinfection))
disinfectionvessel2shift1.vesselId = common.vessels[1].vesselId
disinfectionvessel2shift1.dateSubmitted = new Date(2021,1,1,0,0,0,0)
disinfectionvessel2shift1.timeSubmitted = "0530"
    

describe("Tug Disinfection Record Tests", function() {
    before(function(done) {
        try {
            common.Pretest(async () => {
                superadminuser = await common.CreateSuperAdmin()
                vessel1adminuser = await common.CreateAdminUser(vessel1adminuser.username,vessels[0].vesselId)
                vessel2adminuser = await common.CreateAdminUser(vessel2adminuser.username,vessels[1].vesselId)
                done()
            })
        } catch (err) {
            console.log(err)
            assert.fail("failed pretest")
        }
    });
    it('Tug Disinfection date submitted cannot be empty', async function() {
        try {
            await tugDisinfectionApi.SyncDisinfectionLogs(vessel1adminuser, [{}])
            assert.fail("Invalid log should not be created")
        } catch (err) {
            assert.strictEqual(err.message,"Date submitted cannot be empty")
            return true
        }
    })
    it('Tug Disinfection time submitted cannot be empty', async function() {
        try {
            await tugDisinfectionApi.SyncDisinfectionLogs(vessel1adminuser, [{
                dateSubmitted: new Date()
            }])
            assert.fail("Invalid log should not be created")
        } catch (err) {
            assert.strictEqual(err.message,"Time submitted cannot be empty")
            return true
        }
    })
    it('Tug Disinfection Logs checked by cannot be empty', async function() {
        try {
            await tugDisinfectionApi.SyncDisinfectionLogs(vessel1adminuser,[{ dateSubmitted : new Date(), timeSubmitted : "0530"}])
            assert.fail("Invalid log should not be created")
        } catch (err) {
            assert.strictEqual(err.message,"Log must be checked by someone")
            return true
        }
    })
    it('Tug Disinfection Logs cannot be created by admin of other vessels', async function() {
        try {
            await tugDisinfectionApi.SyncDisinfectionLogs(vessel1adminuser,[disinfectionvessel2shift1])
            assert.fail("Invalid log should not be created")
        } catch (err) {
            assert.strictEqual(err.message,"User unauthorized")
            return true
        }
    })
    it('Tug Disinfection Logs can be created', async function() {
        try {
            await tugDisinfectionApi.SyncDisinfectionLogs(vessel1adminuser,[disinfectionvessel1shift1,disinfectionvessel1shift2])
            let dblogs = await tugDisinfectionApi.GetTugDisinfectionRecord(vessel1adminuser, vessels[0].vesselId)
            assert.strictEqual(dblogs.length, 2)
            let currLogs = [disinfectionvessel1shift1,disinfectionvessel1shift2]
            currLogs.forEach(log => {
                let dblog = dblogs.find(dblog => 
                    dblog.timeSubmitted == log.timeSubmitted && 
                    moment(dblog.dateSubmitted).format("YYYY-MM-DD") == moment(log.dateSubmitted).format("YYYY-MM-DD"))
                areSameRecord(log,dblog,mappings.TUGDISINFECTIONMAP)
            })
            await tugDisinfectionApi.SyncDisinfectionLogs(vessel2adminuser,[disinfectionvessel2shift1])
            return true
        } catch (err) {
            assert.fail(err)
        }
    })
    it('Disinfection Logs cannot be retrieved by unauthorized users', async function() {
        try {
            await tugDisinfectionApi.GetTugDisinfectionRecord(vessel1adminuser, vessels[1].vesselId)
            assert.fail("User should not be able to retrive logs of vessel not belonging to him")
        } catch (err) {
            assert.strictEqual(err.message, "User unauthorized")
        }
    })
})
