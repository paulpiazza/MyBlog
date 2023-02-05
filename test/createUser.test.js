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

const tests = async () => {
    return {
        "new user": {
            email: "admin@myblog.net",
            password: process.env.ADMIN_PWD_TEST
        },

        "login fails": [
            {
                email: "admin@myblog",
                password: process.env.ADMIN_PWD_TEST
            },
            {
                email: "adminmyblog.net",
                password: process.env.ADMIN_PWD_TEST
            }
        ],

        "password fails": [
            {
                email: "admin1@myblog.net",
                password: "123"
            },
            {
                email: "admin2@myblog.net",
                password: "Adm1465654482*"
            },
            {
                email: "admin3@myblog.net",
                password: "AdmH45678"
            }
        ]
    }

}

describe('when the client try to sign in /users/new', function () {

    this.timeout(2500)

    it('should get status OK', async function () {

        const testCredentials = await tests()

        const res = await chai
            .request(app)
            .post('/users/new')
            .send(testCredentials["new user"])

        assert.equal(res.status, 200)
    })

    it('should get error 400 with bad login', async function () {

        const testCredentials = await tests()

        testCredentials["login fails"].forEach(async (credentials) => {

            const res = await chai
                .request(app)
                .post('/users/new')
                .send(credentials)

            assert.equal(res.status, 400)
        })
    })

    it('should get error 400 with bad password', async function () {

        const testCredentials = await tests()

        testCredentials["password fails"].forEach(async (credentials) => {

            const res = await chai
                .request(app)
                .post('/users/new')
                .send(credentials)

            assert.equal(res.status, 400)
        })
    })

    it('should get error 429 - too many requests', async function () {
return false
        const bruteForceLimit = 3

        for (let i = 1; i <= bruteForceLimit; ++i) {
            const res = await chai
                .request(app)
                .post('/users/new')
                .send({
                    email: "adminbruteforce@myblog.net",
                    password: "123"
                })

            if (i === bruteForceLimit) {
                assert.equal(res.status, 429, 'Brute force Not Working')
            }
        }

    })

    after(async function () {

        const count = await User.find().count()

        if (count > 0) {
            await User.deleteMany()
            await User.syncIndexes()
        }
    })

});