const chai = require('chai')
const assert = chai.assert
const chaiHttp = require('chai-http')
const app = require('../index')
const bcrypt = require('bcrypt')
const User = require('../src/models/User')
chai.use(chaiHttp);
const db = require('../src/mongodb/mongodb')
const { triggerAsyncId } = require('async_hooks')
const { resolve } = require('path')

const saltRounds = 10
const delay = 1000

const fakeUser = async () => {
    return {
        email: "admin@myblog.net",
        password: await bcrypt.hash(process.env.ADMIN_PWD_TEST, saltRounds)
    }
}

const tests = {
    "credentials success": {
        email: "admin@myblog.net",
        password: process.env.ADMIN_PWD_TEST
    },

    "login fails": {
        email: "admin@myblog.ne",
        password: process.env.ADMIN_PWD_TEST
    },

    "password fails": {
        email: "admin@myblog.net",
        password: "123"
    }
}

describe('when the client try to log in /users/login', function () {
    
    this.timeout(2500)

    before(`implement users in ${process.env.MONGODB_URI_TEST}`, async function () {
        const user = await fakeUser()

        const docs = await User.insertMany([user])
    })

    it('should get its token', async function () {

        const res = await chai
            .request(app)
            .post('/users/login')
            .send(tests["credentials success"])

        assert.equal(res.status, 200)
        assert.property(res.body, 'token', 'http response have token')
        assert.isNotEmpty(res.body.token, 'token is not an empty string')
    })

    it('should get error 400 with bad login', async function () {

        const res = await chai
            .request(app)
            .post('/users/login')
            .send(tests["login fails"])

        assert.equal(res.status, 400)
    })

    it('should get error 400 with bad password', async function () {

        const res = await chai
            .request(app)
            .post('/users/login')
            .send(tests["password fails"])

        assert.equal(res.status, 400)
    })

    after(async function () {

        const count = await User.find().count()

        if (count > 0) {
            await User.deleteMany()
            await User.syncIndexes()
        }
    })

});