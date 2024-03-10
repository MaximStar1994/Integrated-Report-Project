var assert = require('assert');
const config = require('../config/config')
const {areSameRecord} = require('../helper/helper')
const common = require('./common')
const moment = require('moment')
const temperatureLogApi = require('../api/temperatureTrackingApi')
const {mappings} = require('../services/TemperatureLogService')
const vessels = common.vessels

var vessel1adminuser = {
    username : "vessel1admin"
}
var vessel2adminuser = {
    username : "vessel2admin"
}


var temperaturelogsvessel1slot1 = common.crew.filter((member) => member.vesselId == vessels[0].vesselId).map((member) => {
    let temperaturelog = JSON.parse(JSON.stringify(common.templates.temperaturelog))
    temperaturelog.crewId = member.crewId
    temperaturelog.dateSubmitted = new Date(2021,1,1,10,0,0,0)
    temperaturelog.daySlot = 1
    return temperaturelog
})
var temperaturelogsvessel1slot2 = common.crew.filter((member) => member.vesselId == vessels[0].vesselId).map((member) => {
    let temperaturelog = JSON.parse(JSON.stringify(common.templates.temperaturelog))
    temperaturelog.crewId = member.crewId
    temperaturelog.temperature = 37.5
    temperaturelog.dateSubmitted = new Date(2021,1,1,10,0,0,0)
    temperaturelog.daySlot = 2
    return temperaturelog
})
var temperaturelogsvessel2 = common.crew.filter((member) => member.vesselId == vessels[1].vesselId).map((member) => {
    let temperaturelog = JSON.parse(JSON.stringify(common.templates.temperaturelog))
    temperaturelog.crewId = member.crewId
    temperaturelog.temperature = 37.5
    temperaturelog.dateSubmitted = new Date(2021,1,1,10,0,0,0)
    temperaturelog.daySlot = 2
    return temperaturelog
})
var invalidtempearturelogs = common.crew.map((member) => {
    let temperaturelog = JSON.parse(JSON.stringify(common.templates.temperaturelog))
    temperaturelog.crewId = member.crewId
    temperaturelog.temperature = 37.5
    temperaturelog.dateSubmitted = new Date(2021,1,1,10,0,0,0)
    temperaturelog.daySlot = 2
    return temperaturelog
})

describe("Temperature Log Tests", function() {
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
    it('Temperature Logs date submitted cannot be empty', async function() {
        try {
            await temperatureLogApi.SyncTemperatureLogs(vessel1adminuser,[{}])
            assert.fail("Invalid log should not be created")
        } catch (err) {
            assert.strictEqual(err.message,"Date submitted cannot be empty")
            return true
        }
    })
    it('Temperature Logs crew id cannot be empty', async function() {
        try {
            await temperatureLogApi.SyncTemperatureLogs(vessel1adminuser,[{ dateSubmitted : new Date()}])
            assert.fail("Invalid log should not be created")
        } catch (err) {
            assert.strictEqual(err.message,"Crew must be selected")
            return true
        }
    })
    it('Temperature Logs temperature cannot be empty', async function() {
        try {
            await temperatureLogApi.SyncTemperatureLogs(vessel1adminuser,[{ dateSubmitted : new Date(), crewId : common.crew[0].crewId}])
            assert.fail("Invalid log should not be created")
        } catch (err) {
            assert.strictEqual(err.message,"Temperature submitted cannot be empty")
            return true
        }
    })
    it('Temperature Logs day slot cannot be empty', async function() {
        try {
            await temperatureLogApi.SyncTemperatureLogs(vessel1adminuser,[{ dateSubmitted : new Date(), crewId : common.crew[0].crewId, temperature : 10}])
            assert.fail("Invalid log should not be created")
        } catch (err) {
            assert.strictEqual(err.message,"Day Slot must be selected")
            return true
        }
    })
    it('Temperature Logs cannot be created by admin of other vessels', async function() {
        try {
            await temperatureLogApi.SyncTemperatureLogs(vessel1adminuser,invalidtempearturelogs)
            assert.fail("Invalid log should not be created")
        } catch (err) {
            assert.strictEqual(err.message,"User unauthorized")
            return true
        }
    })
    it('Temperature Logs can be created', async function() {
        try {
            await temperatureLogApi.SyncTemperatureLogs(vessel1adminuser,temperaturelogsvessel1slot1)
            var dateSubmitted = moment(temperaturelogsvessel1slot1[0].dateSubmitted)
            var dblogs = await temperatureLogApi.GetCrewTemperature(vessel1adminuser, dateSubmitted.year(),dateSubmitted.week(), common.vessels[0].vesselId)
            temperaturelogsvessel1slot1.forEach(log => {
                let dblog = dblogs.find(dblog => 
                    dblog.crewId == log.crewId && 
                    dblog.daySlot === log.daySlot && 
                    moment(dblog.dateSubmitted).format("YYYY-MM-DD") == moment(log.dateSubmitted).format("YYYY-MM-DD"))
                areSameRecord(log,dblog,mappings.TEMPERATURELOGMAP)
            })
            await temperatureLogApi.SyncTemperatureLogs(vessel2adminuser,temperaturelogsvessel2)
            dateSubmitted = moment(temperaturelogsvessel2[0].dateSubmitted)
            dblogs = await temperatureLogApi.GetCrewTemperature(vessel2adminuser, dateSubmitted.year(),dateSubmitted.week(), common.vessels[1].vesselId)
            temperaturelogsvessel2.forEach(log => {
                let dblog = dblogs.find(dblog => 
                    dblog.crewId == log.crewId && 
                    dblog.daySlot === log.daySlot && 
                    moment(dblog.dateSubmitted).format("YYYY-MM-DD") == moment(log.dateSubmitted).format("YYYY-MM-DD"))
                areSameRecord(log,dblog,mappings.TEMPERATURELOGMAP)
            })
        } catch (err) {
            assert.fail(err)
        }
    })
    it('Temperature Logs can be updated', async function() {
        try {
            temperaturelogsvessel2.map(log => log.temperature = 22.22)
            await temperatureLogApi.SyncTemperatureLogs(vessel2adminuser,temperaturelogsvessel2)
            var dateSubmitted = moment(temperaturelogsvessel2[1].dateSubmitted)
            var dblogs = await temperatureLogApi.GetCrewTemperature(vessel2adminuser, dateSubmitted.year(),dateSubmitted.week(), common.vessels[1].vesselId)
            temperaturelogsvessel2.forEach(log => {
                let dblog = dblogs.find(dblog => 
                    dblog.crewId == log.crewId && 
                    dblog.daySlot === log.daySlot && 
                    moment(dblog.dateSubmitted).format("YYYY-MM-DD") == moment(log.dateSubmitted).format("YYYY-MM-DD"))
                areSameRecord(log,dblog,mappings.TEMPERATURELOGMAP)
            })
        } catch (err) {
            assert.fail(err)
        }
    })
    it('Temperature Logs can be added on for different slots', async function() {
        try {
            await temperatureLogApi.SyncTemperatureLogs(vessel1adminuser,temperaturelogsvessel1slot2)
            var dateSubmitted = moment(temperaturelogsvessel1slot1[0].dateSubmitted)
            var dblogs = await temperatureLogApi.GetCrewTemperature(vessel1adminuser, dateSubmitted.year(),dateSubmitted.week(), common.vessels[0].vesselId)
            temperaturelogsvessel1slot1.forEach(log => {
                let dblog = dblogs.find(dblog => 
                    dblog.crewId == log.crewId && 
                    dblog.daySlot === log.daySlot && 
                    moment(dblog.dateSubmitted).format("YYYY-MM-DD") == moment(log.dateSubmitted).format("YYYY-MM-DD"))
                areSameRecord(log,dblog,mappings.TEMPERATURELOGMAP)
            })
            temperaturelogsvessel1slot2.forEach(log => {
                let dblog = dblogs.find(dblog => 
                    dblog.crewId == log.crewId && 
                    dblog.daySlot === log.daySlot && 
                    moment(dblog.dateSubmitted).format("YYYY-MM-DD") == moment(log.dateSubmitted).format("YYYY-MM-DD"))
                areSameRecord(log,dblog,mappings.TEMPERATURELOGMAP)
            })
        } catch (err) {
            assert.fail(err)
        }
    })
})
