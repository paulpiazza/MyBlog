const chai = require('chai')
const assert = chai.assert
const chaiHttp = require('chai-http')
const app = require('../index')
const bcrypt = require('bcrypt')
const User = require('../src/models/User')
chai.use(chaiHttp);
const db = require('../src/mongodb/mongodb')
const { triggerAsyncId } = require('async_hooks')

describe('when the client try to log in /users/login', function () {

    before(`implement users in ${process.env.MONGODB_URI_TEST}`, async function () {

        const saltRounds = 10

        const users = [
            {
                email: "admin@myblog.net",
                password: await bcrypt.hash(process.env.ADMIN_PWD_TEST, saltRounds)
            },
            {
                email: "user@myblog.net",
                password: await bcrypt.hash(process.env.USER_PWD_TEST, saltRounds)
            }
        ] 

        try {
            const docs = await User.insertMany(users)

            console.info(`${docs.length} Users fixtures added.\n`)

        } catch(err) {
            console.error("Loading fixtures Users failed.", err)
        }

    })

    it('should get its token', function (done) {
        chai
            .request(app)
            .post('/users/login')
            .send({
                email: "user@myblog.net",
                password: process.env.USER_PWD_TEST
            })
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, 'token', 'http response have token')
                assert.isNotEmpty(res.body.token, 'token is not an empty string')
                done()
            })
    })

    it('should get error 400', function (done) {
        chai
            .request(app)
            .post('/users/login')
            .send({
                email: "user@myblog.net",
                password: 'a'
            })
            .end((err, res) => {
                assert.equal(res.status, 400)
                done()
            })
    })

    after(async function () {

        const count = await User.find().count()

        if (count > 0) {
            await User.deleteMany()
            await User.syncIndexes()
        }
    })

});