var assert = require('assert');
const {areSameRecord} = require('../helper/helper')
const common = require('./common')
const moment = require('moment')
const vesselBreakdownApi = require('../api/vesselBreakdownApi')
const {mappings} = require('../services/VesselBreakdownService');
const vessels = common.vessels

var vessel1adminuser = {
    username : "vessel1admin"
}
var vessel2adminuser = {
    username : "vessel2admin"
}
let event1vessel1 = JSON.parse(JSON.stringify(common.templates.vesselBreakdownEvent))
event1vessel1.vesselId = vessels[0].vesselId
let event1vessel2 = JSON.parse(JSON.stringify(common.templates.vesselBreakdownEvent))
event1vessel2.vesselId = vessels[1].vesselId
let event1vessel1support1 = JSON.parse(JSON.stringify(common.templates.vesselBreakdownEventSupport))

describe("Vessel Breakdown Record Tests", function() {
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
    it('Breakdown event date submitted cannot be empty', async function() {
        try {
            await vesselBreakdownApi.SyncEvents(vessel1adminuser, [{}])
            assert.fail("Breakdown datetime cannot be empty")
        } catch (err) {
            assert.strictEqual(err.message,"Breakdown datetime cannot be empty")
            return true
        }
    })
    it('Breakdown event reason cannot be empty', async function() {
        try {
            await vesselBreakdownApi.SyncEvents(vessel1adminuser, [{
                breakdownDatetime: new Date()
            }])
            assert.fail("Breakdown reason cannot be empty")
        } catch (err) {
            assert.strictEqual(err.message,"Breakdown reason cannot be empty")
            return true
        }
    })
    it('Breakdown events cannot be created without vesselId', async function() {
        try {
            await vesselBreakdownApi.SyncEvents(vessel1adminuser,[{
                breakdownDatetime: new Date(),
                reason : "fail"
            }])
            assert.fail("Unauthorized log should not be created")
        } catch (err) {
            assert.strictEqual(err.message,"User unauthorized")
            return true
        }
    })
    it('Breakdown events cannot be created by admin of other vessels', async function() {
        try {
            await vesselBreakdownApi.SyncEvents(vessel1adminuser,[event1vessel2,event1vessel1])
            assert.fail("Unauthorized log should not be created")
        } catch (err) {
            assert.strictEqual(err.message,"User unauthorized")
            let events = await vesselBreakdownApi.GetBreakDownEventsForTug(vessel1adminuser, vessels[0].vesselId)
            assert.strictEqual(events.length,0)
            return true
        }
    })
    it('Breakdown events can be created', async function() {
        try {
            await vesselBreakdownApi.SyncEvents(vessel1adminuser,[event1vessel1])
            let events = await vesselBreakdownApi.GetBreakDownEventsForTug(vessel1adminuser, vessels[0].vesselId)
            assert.strictEqual(events.length, 1)
            event1vessel1.status = "open"
            event1vessel1.eventId = events[0].eventId
            event1vessel1support1.eventId = events[0].eventId
            areSameRecord(event1vessel1,events[0],mappings.VESSELBREAKDOWNEVENTMAP)
            await vesselBreakdownApi.SyncEvents(vessel2adminuser,[event1vessel2])
            return true
        } catch (err) {
            assert.fail(err)
        }
    })
    it("Support cannot have invalid event", async function() {
        try {
            await vesselBreakdownApi.PostBreakdownEventSupport(vessel1adminuser, {})
            assert.fail("Support cannot have invalid event")
        } catch (err) {
            assert.strictEqual(err.message,"Invalid event")
            return true
        }
    })
    it("Support superintendent in charge cannot be empty", async function() {
        try {
            await vesselBreakdownApi.PostBreakdownEventSupport(vessel1adminuser, {
                eventId : event1vessel1.eventId
            })
            assert.fail("Superintendent in charge cannot be empty")
        } catch (err) {
            assert.strictEqual(err.message,"Superintendent in charge cannot be empty")
            return true
        }
    })
    it("Support category cannot be empty", async function() {
        try {
            await vesselBreakdownApi.PostBreakdownEventSupport(vessel1adminuser, {
                eventId : event1vessel1.eventId,
                superintendent : "ng"
            })
            assert.fail("Category cannot be empty")
        } catch (err) {
            assert.strictEqual(err.message,"Category cannot be empty")
            return true
        }
    })
    it("Support remarks cannot be empty", async function() {
        try {
            await vesselBreakdownApi.PostBreakdownEventSupport(vessel1adminuser, {
                eventId : event1vessel1.eventId,
                superintendent : "ng",
                category : "cat1"
            })
            assert.fail("Remarks cannot be empty")
        } catch (err) {
            assert.strictEqual(err.message,"Remarks cannot be empty")
            return true
        }
    })
    it("Support Tug Replacement cannot be empty", async function() {
        try {
            await vesselBreakdownApi.PostBreakdownEventSupport(vessel1adminuser, {
                eventId : event1vessel1.eventId,
                superintendent : "ng",
                category : "cat1",
                remarks : "remarkable"
            })
            assert.fail("Tug Replacement cannot be empty")
        } catch (err) {
            assert.strictEqual(err.message,"Tug Replacement cannot be empty")
            return true
        }
    })
    it("Support Tug Condition cannot be empty", async function() {
        try {
            await vesselBreakdownApi.PostBreakdownEventSupport(vessel1adminuser, {
                eventId : event1vessel1.eventId,
                superintendent : "ng",
                category : "cat1",
                remarks : "remarkable",
                tugReplacement : "na"
            })
            assert.fail("Tug Condition cannot be empty")
        } catch (err) {
            assert.strictEqual(err.message,"Tug Condition cannot be empty")
            return true
        }
    })
    it("Support cannot be created for event for other tug", async function() {
        try {
            await vesselBreakdownApi.PostBreakdownEventSupport(vessel2adminuser, {
                eventId : event1vessel1.eventId,
                superintendent : "ng",
                category : "cat1",
                remarks : "remarkable",
                tugReplacement : "na",
                tugCondition : "operational",
            })
            assert.fail("User unauthorized")
        } catch (err) {
            assert.strictEqual(err.message,"User unauthorized")
            return true
        }
    })
    it('Breakdown event support can be created', async function() {
        try {
            let dbsupport = await vesselBreakdownApi.PostBreakdownEventSupport(vessel1adminuser, event1vessel1support1)
            event1vessel1support1.recordId = dbsupport.record_id
            let events = await vesselBreakdownApi.GetBreakDownEventsForTug(vessel1adminuser, vessels[0].vesselId)
            let event1 = events.find(event => event.eventId == event1vessel1.eventId)
            assert.strictEqual(moment(event1.support[0].updateDate).format("YYYY-MM-DD"), moment().format("YYYY-MM-DD"))
            delete event1.support[0].updateDate
            areSameRecord(event1vessel1support1,event1.support[0],mappings.BREAKDOWNSUPPORTMAP)
            return true
        } catch (err) {
            assert.fail(err)
        }
    })
    it('Breakdown event support operational will result in event to close and update operation date', async function() {
        try {
            await vesselBreakdownApi.PostBreakdownEventSupport(vessel1adminuser, JSON.parse(JSON.stringify(event1vessel1support1)))
            let events = await vesselBreakdownApi.GetBreakDownEventsForTug(vessel1adminuser, vessels[0].vesselId)
            let event1 = events.find(event => event.eventId == event1vessel1.eventId)
            assert.strictEqual(event1.status,"close")
            assert.strictEqual(moment(event1.backToOperationDatetime).format("YYYY-MM-DD"), moment().format("YYYY-MM-DD"))
            return true
        } catch (err) {
            assert.fail(err)
        }
    })
    it('Breakdown event support can be updated', async function() {
        try {
            event1vessel1support1.superintendent = "lala"
            event1vessel1support1.category="na"
            event1vessel1support1.remarks="newremark"
            event1vessel1support1.tugReplacement="engine"
            event1vessel1support1.tugCondition="non operational"
            await vesselBreakdownApi.PostBreakdownEventSupport(vessel1adminuser, JSON.parse(JSON.stringify(event1vessel1support1)))
            let events = await vesselBreakdownApi.GetBreakDownEventsForTug(vessel1adminuser, vessels[0].vesselId)
            let event1 = events.find(event => event.eventId == event1vessel1.eventId)
            delete event1.support[0].updateDate
            areSameRecord(event1vessel1support1,event1.support[0],mappings.BREAKDOWNSUPPORTMAP)
            return true
        } catch (err) {
            assert.fail(err)
        }
    })
    it('Breakdown event support non operational will update event back to operation date time', async function() {
        try {
            await vesselBreakdownApi.PostBreakdownEventSupport(vessel1adminuser,JSON.parse(JSON.stringify(event1vessel1support1)))
            let events = await vesselBreakdownApi.GetBreakDownEventsForTug(vessel1adminuser, vessels[0].vesselId)
            let event1 = events.find(event => event.eventId == event1vessel1.eventId)
            assert.strictEqual(event1.status,"close")
            assert.strictEqual(event1.backToOperationDatetime, null)
            return true
        } catch (err) {
            assert.fail(err)
        }
    })
})
