const chai = require('chai')
const assert = chai.assert
const chaiHttp = require('chai-http')
const app = require('../index')
const User = require('../src/models/User')
const bcrypt = require('bcrypt')

chai.use(chaiHttp);

const saltRounds = 10
const delay = 1000

const fakeUser = async () => {
    return {
        email: "admin@myblog.net",
        password: await bcrypt.hash(process.env.ADMIN_PWD_TEST, saltRounds)
    }
}

describe('when the client request its profile /profile/me', function () {

    let tokenTest = ''

    this.timeout(5500)

    before('Create a new user and get its token', async function () {

        const user = await fakeUser()

        const docs = await User.insertMany([user])

        await new Promise(function (resolve) {
            setTimeout(() => resolve(), 2500)
        })

        const res = await chai
            .request(app)
            .post('/users/login')
            .send({
                email: "admin@myblog.net",
                password: process.env.ADMIN_PWD_TEST
            })

        tokenTest = res.body.token

        if (!tokenTest) {
            console.error('no token got', res.body)
        }
    })

    it('should get its profile', async function () {

        if (!tokenTest) return false

        const res = await chai
            .request(app)
            .get('/profile/me')
            .auth(tokenTest, { type: 'bearer' })

        assert.equal(res.status, 200);
    })

    it('should update its profile', async function () {

        if (!tokenTest) return false

        const res = await chai
            .request(app)
            .put('/profile/me')
            .auth(tokenTest, { type: 'bearer' })
            .send({
                email: "adminTestUpdate@myblog.net",
                password: "Admin1234*"
            })

        assert.equal(res.status, 200);
    })

    it('should delete its account', async function () {

        if (!tokenTest) return false

        const res = await chai
            .request(app)
            .delete('/profile/me')
            .auth(tokenTest, { type: 'bearer' })

        assert.equal(res.status, 200);
    })

    after(async function () {

        const count = await User.find().count()

        if (count > 0) {
            await User.deleteMany()
            await User.syncIndexes()
        }
    })
});