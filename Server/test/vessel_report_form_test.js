var assert = require('assert');
const config = require('../config/config')
const {areSameRecord} = require('../helper/helper')
const common = require('./common')
const moment = require('moment')
const vesselReportApi = require('../api/vesselReportApi')
const {mappings} = require('../services/VesselReportService');
const vessels = common.vessels
var superadminuser = {}
var vessel1adminuser = {
    username : "vessel1admin"
}
var vessel2adminuser = {
    username : "vessel2admin"
}
var vessel1userlock = null
var vessel2userlock = null
var vesselreportform1vessel1 = JSON.parse(JSON.stringify(common.templates.vesselreportform))
var vesselreportform2vessel1 = JSON.parse(JSON.stringify(common.templates.vesselreportform))
vesselreportform2vessel1.formDate =  new Date(2021,2,1,20,0,0,0)
vesselreportform2vessel1.shift = 2
vesselreportform2vessel1.decklogs[0].starttime = new Date(2021,2,1,20,0,0,0)
vesselreportform2vessel1.decklogs[0].endtime = new Date(2021,2,1,21,0,0,0)
vesselreportform2vessel1.decklogs[1].starttime = new Date(2021,2,1,19,0,0,0)
vesselreportform2vessel1.decklogs[1].endtime = new Date(2021,2,1,19,30,0,0)
var vesselreportform1vessel2 = JSON.parse(JSON.stringify(common.templates.vesselreportform))
vesselreportform1vessel2.vesselId = 2
vesselreportform1vessel2.crew = [{
    crewId : 7,
    isWorking : true,
    shift: 1
},{
    crewId : 8,
    isWorking : true,
    shift: 1
},{
    crewId : 9,
    isWorking : true,
    shift: 1
},{
    crewId : 10,
    isWorking : false,
    shift: 2
},{
    crewId : 11,
    isWorking : false,
    shift: 2
},{
    crewId : 12,
    isWorking : false,
    shift: 2
}]

var invalidDeckLog = JSON.parse(JSON.stringify(common.templates.vesselreportform))
invalidDeckLog.decklogs[0].endtime = new Date(2021,1,1,20,0,0,0)
invalidDeckLog.decklogs[0].starttime = new Date(2021,1,1,21,0,0,0)
invalidDeckLog.decklogs[1].starttime = new Date(2021,1,1,19,0,0,0)
invalidDeckLog.decklogs[1].endtime = new Date(2021,1,1,19,30,0,0)
var invalidCrew = JSON.parse(JSON.stringify(common.templates.vesselreportform))
invalidCrew.vesselId = 2

const areSameReports = (report1,report2) => {
    assert.strictEqual(report1.shift, report2.shift)
    assert.strictEqual(moment(report1.formDate).format("YYYY-MM-DD"), moment(report2.formDate).format("YYYY-MM-DD"))
}
const areSameDecklogs = (decklog1,decklog2) => {
    assert.strictEqual(decklog1.startLocation, decklog2.startLocation)
    assert.strictEqual(decklog1.endLocation, decklog2.endLocation)
    assert.strictEqual(decklog1.status, decklog2.status)
    assert.strictEqual(decklog1.typeOfJob, decklog2.typeOfJob)
    assert.strictEqual(decklog1.tugPosition, decklog2.tugPosition)
    assert.strictEqual(decklog1.noOfTugs, parseFloat(decklog2.noOfTugs))
    assert.strictEqual(moment(decklog1.starttime).format("YYYY-MM-DD HH:mm:ss"), moment(decklog2.starttime).format("YYYY-MM-DD HH:mm:ss"))
    assert.strictEqual(moment(decklog1.endtime).format("YYYY-MM-DD HH:mm:ss"), moment(decklog2.endtime).format("YYYY-MM-DD HH:mm:ss"))
}


describe("Vessel Report Tests", function() {
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
    it('Vessel Report Page can be Locked', async function() {
        try {
            var canview = await vesselReportApi.CanViewVesselReportPage(vessel1userlock,vessels[0].vesselId)
            assert.strictEqual(canview,true)
            vessel1userlock = await vesselReportApi.LockVesselReportPage(vessel1userlock, vessels[0].vesselId)
            canview = await vesselReportApi.CanViewVesselReportPage(vessel1userlock,vessels[0].vesselId)
            assert.strictEqual(canview,true, "Locked page should be viewable by valid key")
            return true
        } catch (err) {
            assert.fail(err)
        }
    })
    it('Locked Vessel Report Page cannot be viewed', async function() {
        try {
            let canview = await vesselReportApi.CanViewVesselReportPage(vessel2userlock,vessels[0].vesselId)
            assert.strictEqual(canview,false)
            return true
        } catch (err) {
            assert.fail(err)
        }
    })
    it('Vessel Report Page should be locked by vessel', async function() {
        try {
            let canview = await vesselReportApi.CanViewVesselReportPage(vessel2userlock,vessels[1].vesselId)
            assert.strictEqual(canview,true)
            return true
        } catch (err) {
            assert.fail(err)
        }
    })
    it('Locked Vessel Report Page cannot be unlocked by invalid key', async function() {
        try {
            await vesselReportApi.UnlockVesselReportPage(vessel2userlock,vessels[0].vesselId)
            assert.fail( "Locked page should not be unlocked by invalid key")
        } catch (err) {
            assert.strictEqual("Another device is accessing this page now",err.message)
            return true
        }
    })
    it('Locked Vessel Report Page can be unlocked by valid key', async function() {
        try {
            await vesselReportApi.UnlockVesselReportPage(vessel1userlock,vessels[0].vesselId)
            vessel1userlock = null
            var canview = await vesselReportApi.CanViewVesselReportPage(vessel1userlock,vessels[0].vesselId)
            assert.strictEqual(canview,true)
            return true
        } catch (err) {
            assert.fail(err)
        }
    })
    it('Vessel Report Pages cannot be submitted with missing vessel id', async function(){
        try {
            await vesselReportApi.SyncVesselReport(vessel1adminuser, {})
            assert.fail( "Missing vessel id should not pass")
        } catch (err) {
            assert.strictEqual("Missing Vessel Id",err.message)
            return true
        }
    })
    it('Vessel Report Pages cannot be submitted with missing crew', async function(){
        var missingCrew = JSON.parse(JSON.stringify(common.templates.vesselreportform))
        delete missingCrew.crew
        try {
            await vesselReportApi.SyncVesselReport(vessel1adminuser, missingCrew)
            assert.fail( "Missing crew should not pass")
        } catch (err) {
            assert.strictEqual("Invalid crew",err.message)
            return true
        }
    })
    it('Vessel Report Pages cannot be submitted with invalid crew', async function(){
        try {
            await vesselReportApi.SyncVesselReport(vessel1adminuser, invalidCrew)
            assert.fail( "Invalid crew should not pass")
        } catch (err) {
            assert.strictEqual("Invalid crew",err.message)
            return true
        }
    })
    it('Vessel Report Pages cannot be submitted with invalid deck logs', async function(){
        try {
            await vesselReportApi.SyncVesselReport(vessel1adminuser, invalidDeckLog)
            assert.fail( "Invalid deck log should not pass")
        } catch (err) {
            assert.strictEqual("Invalid log",err.message)
            return true
        }
    })
    it('Vessel Report Pages cannot be synced by invalid user', async function(){
        try {
            await vesselReportApi.SyncVesselReport(vessel2adminuser, vesselreportform1vessel1)
            assert.fail( "Unauthorized user cannot sync")
        } catch (err) {
            assert.strictEqual("Unauthorized",err.message)
            return true
        }
    })
    it('Vessel Report Pages can be synced', async function(){
        try {
            let vesselreports = await vesselReportApi.SyncVesselReports(vessel1adminuser, [vesselreportform1vessel1, vesselreportform2vessel1])
            vesselreportform1vessel1.formId = vesselreports[0].formId
            vesselreportform2vessel1.formId = vesselreports[1].formId
            vesselreports = await vesselReportApi.SyncVesselReports(vessel2adminuser, [vesselreportform1vessel2])
            vesselreportform1vessel2.formId = vesselreports[0].formId
            let dbreport = await vesselReportApi.GetVesselReport(vesselreportform1vessel1.formId)
            areSameRecord(dbreport, vesselreportform1vessel1, mappings.vesselreport)
            return true
        } catch (err) {
            assert.fail(err)
        }
    })
    it('Vessel Report ROB Logs are created successfully', async function(){
        try {
            let dbreport = await vesselReportApi.GetVesselReport(vesselreportform1vessel1.formId)
            assert.strictEqual(dbreport.rob.length, vesselreportform1vessel1.rob.length)
            vesselreportform1vessel1.rob.forEach(log => {
                const dblog = dbreport.rob.find(dblog => dblog.identifier == log.identifier)
                areSameRecord(dblog,log,mappings.rob)
            })
            return true
        } catch (err) {
            assert.fail(err)
        }
    })
    it('Vessel Report Tank Sounding Logs are created successfully', async function(){
        try {
            let dbreport = await vesselReportApi.GetVesselReport(vesselreportform1vessel1.formId)
            assert.strictEqual(dbreport.tanksoundings.length, vesselreportform1vessel1.tanksoundings.length)
            vesselreportform1vessel1.tanksoundings.forEach(log => {
                const dblog = dbreport.tanksoundings.find(dblog => dblog.identifier == log.identifier)
                areSameRecord(dblog,log,mappings.tanksounding)
            })
            return true
        } catch (err) {
            assert.fail(err)
        }
    })
    it('Vessel Report Generator Logs are created successfully', async function(){
        try {
            let dbreport = await vesselReportApi.GetVesselReport(vesselreportform1vessel1.formId)
            assert.strictEqual(dbreport.generators.length, vesselreportform1vessel1.generators.length)
            vesselreportform1vessel1.generators.forEach(log => {
                const dblog = dbreport.generators.find(dblog => dblog.generatorIdentifier == log.generatorIdentifier)
                areSameRecord(dblog,log,mappings.generator)
            })
            return true
        } catch (err) {
            assert.fail(err)
        }
    })
    it('Vessel Report Enginelogs are created successfully', async function(){
        try {
            let dbreport = await vesselReportApi.GetVesselReport(vesselreportform1vessel1.formId)
            assert.strictEqual(dbreport.engines.length, 2)
            vesselreportform1vessel1.engines.forEach(log => {
                const dblog = dbreport.engines.find(dblog => dblog.engineIdentifier == log.engineIdentifier)
                areSameRecord(dblog,log,mappings.elog)
            })
            return true
        } catch (err) {
            assert.fail(err)
        }
    })
    it('Vessel Report ZpClutch are created successfully', async function(){
        try {
            let dbreport = await vesselReportApi.GetVesselReport(vesselreportform1vessel1.formId)
            assert.strictEqual(dbreport.zpClutch.length, vesselreportform1vessel1.zpClutch.length)
            vesselreportform1vessel1.zpClutch.forEach(log => {
                const dblog = dbreport.zpClutch.find(dblog => dblog.identifier == log.identifier)
                areSameRecord(dblog,log,mappings.zpclutch)
            })
            return true
        } catch (err) {
            assert.fail(err)
        }
    })
    it('Vessel Report Decklogs are created successfully', async function(){
        try {
            let dbreport = await vesselReportApi.GetVesselReport(vesselreportform1vessel1.formId)
            areSameReports(dbreport, vesselreportform1vessel1)
            assert.strictEqual(dbreport.decklogs.length,2)
            areSameDecklogs(dbreport.decklogs[0],vesselreportform1vessel1.decklogs[1])
            areSameDecklogs(dbreport.decklogs[1],vesselreportform1vessel1.decklogs[0])
            return true
        } catch (err) {
            assert.fail(err)
        }
    })
    it('Vessel Report Crew are created successfully', async function(){
        try {
            let dbreport = await vesselReportApi.GetVesselReport(vesselreportform1vessel1.formId)
            areSameReports(dbreport, vesselreportform1vessel1)
            assert.strictEqual(dbreport.crew.length,6)
            var vessel1crew = common.crew.filter(member => member.vesselId == 1)
            
            var crew1 = dbreport.crew.find(member => member.crewId == vesselreportform1vessel1.crew[0].crewId)
            assert.strictEqual(crew1.name,  vessel1crew.find(member => vesselreportform1vessel1.crew[0].crewId == member.crewId).name)
            assert.strictEqual(crew1.isWorking, vesselreportform1vessel1.crew[0].isWorking)
            var crew2 = dbreport.crew.find(member => member.crewId == vesselreportform1vessel1.crew[1].crewId)
            assert.strictEqual(crew2.name,  vessel1crew.find(member => vesselreportform1vessel1.crew[1].crewId == member.crewId).name)
            assert.strictEqual(crew2.isWorking, vesselreportform1vessel1.crew[1].isWorking)
            var crew3 = dbreport.crew.find(member => member.crewId == vesselreportform1vessel1.crew[2].crewId)
            assert.strictEqual(crew3.name,  vessel1crew.find(member => vesselreportform1vessel1.crew[2].crewId == member.crewId).name)
            assert.strictEqual(crew3.isWorking, vesselreportform1vessel1.crew[2].isWorking)
            var crew4 = dbreport.crew.find(member => member.crewId == vesselreportform1vessel1.crew[3].crewId)
            assert.strictEqual(crew4.name,  vessel1crew.find(member => vesselreportform1vessel1.crew[3].crewId == member.crewId).name)
            assert.strictEqual(crew4.isWorking, vesselreportform1vessel1.crew[3].isWorking)
            var crew5 = dbreport.crew.find(member => member.crewId == vesselreportform1vessel1.crew[4].crewId)
            assert.strictEqual(crew5.name,  vessel1crew.find(member => vesselreportform1vessel1.crew[4].crewId == member.crewId).name)
            assert.strictEqual(crew5.isWorking, vesselreportform1vessel1.crew[4].isWorking)
            var crew6 = dbreport.crew.find(member => member.crewId == vesselreportform1vessel1.crew[5].crewId)
            assert.strictEqual(crew6.name,  vessel1crew.find(member => vesselreportform1vessel1.crew[5].crewId == member.crewId).name)
            assert.strictEqual(crew6.isWorking, vesselreportform1vessel1.crew[5].isWorking)
            return true
        } catch (err) {
            assert.fail(err)
        }
    })
    it('Vessel Report Pages can be listed by vessel', async function(){
        try {
            let reports = await vesselReportApi.ListVesselReport(vessels[0].vesselId)
            assert.strictEqual(reports.length, 2)
            var report1 = reports.find(report => report.formId == vesselreportform1vessel1.formId)
            areSameReports(report1,vesselreportform1vessel1)
            var report2 = reports.find(report => report.formId == vesselreportform2vessel1.formId)
            areSameReports(report2,vesselreportform2vessel1)
            reports = await vesselReportApi.ListVesselReport(vessels[1].vesselId)
            report1 = reports.find(report => report.formId == vesselreportform1vessel2.formId)
            areSameReports(report1,vesselreportform1vessel2)
            return true
        } catch (err) {
            assert.fail(err)
        }
    })
    it('Vessel Report Pages is listed chronologically', async function(){
        try {
            let reports = await vesselReportApi.ListVesselReport(vessels[0].vesselId)
            assert.strictEqual(reports.length, 2)
            var report1 = reports[0]
            areSameReports(report1,vesselreportform2vessel1)
            var report2 = reports[1]
            areSameReports(report2,vesselreportform1vessel1)
            return true
        } catch (err) {
            assert.fail(err)
        }
    })
    it('Crew Work and Rest Hours Updated', async function(){
        try {
            let hours = await vesselReportApi.GetCrewWorkAndRestHour(vesselreportform2vessel1.formDate,vessels[0].vesselId)
            let crew1workinghours = hours.find(crew => crew.crewId == common.crew[0].crewId)
            let crew5workinghours = hours.find(crew => crew.crewId == common.crew[3].crewId)
            let formDate = moment(vesselreportform2vessel1.formDate).format('DD-MM-YYYY')
            assert.strictEqual(crew1workinghours.monthWorkingStatus[formDate].morningShift, false)
            assert.strictEqual(crew1workinghours.monthWorkingStatus[formDate].nightShift, true)
            assert.strictEqual(crew5workinghours.monthWorkingStatus[formDate].morningShift, false)
            assert.strictEqual(crew5workinghours.monthWorkingStatus[formDate].nightShift, false)
            return true
        } catch (err) {
            assert.fail(err)
        }
    })
})