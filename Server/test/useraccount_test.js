var assert = require('assert');
const config = require('../config/config')
const common = require('./common')
const api = require('../api')
const vessels = common.vessels
var superadminuser = {}
var vessel1adminuser = {}
describe("User Account Tests", function() {
    before(function(done) {
        try {
            common.Pretest(async () => {
                superadminuser = await common.CreateSuperAdmin()
                done()
            })
        } catch (err) {
            console.log(err)
            assert.fail("failed pretest")
        }
    });
    it('Vessel admin can be created', async function() {
        try {
            vessel1adminuser = await api.SignUp("vessel1admin","vessel1admin",vessels[0].vesselId)
            let dbuser = await api.Login("vessel1admin","vessel1admin")
            assert.strictEqual(dbuser.accountId, vessel1adminuser.accountId)
            return true
        } catch (err) {
            assert.fail(err)
            return false
        }
    })
    it('Duplicate username cannot be created', async function() {
        try {
            await api.SignUp("vessel1admin","vessel1admin",vessels[0].vesselId)
            assert.fail("User should not be able to sign up")
        } catch (err) {
            assert.strictEqual("User already exist",err.message)
            return true
        }
    })
    it('Invalid credentials will be rejected', async function() {
        try {
            await api.Login("vessel1admin","vessel2admin")
            assert.fail("User should not be able to sign in with wrong password")
        } catch (err) {
            assert.strictEqual("Invalid Password",err.message)
            return true
        }
    })
    it('Invalid username will be rejected', async function() {
        try {
            await api.Login("vessel2admin","vessel2admin")
            assert.fail("User should not be able to sign in with invalid username")
        } catch (err) {
            assert.strictEqual("No such user found!",err.message)
            return true
        }
    })
})