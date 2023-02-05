const chai = require('chai')
const assert = chai.assert
const chaiHttp = require('chai-http')
const app = require('../index')
const User = require('../src/models/User')
const bcrypt = require('bcrypt')

chai.use(chaiHttp);

const fakePassword = "Admin1234*"

const fakeUser = async () => {
    return {
        email: "usertest@myblog.net",
        password: await bcrypt.hash(fakePassword, 10)
    }
}

describe('when the client request its profile /profile/me', function () {

    let tokenTest = ''

    before('Create a new user and get its token', async function () {

        const userTestData = await fakeUser()

        const docs = await User.create(userTestData)

        const res = await chai
            .request(app)
            .post('/users/login')
            .send({
                email: userTestData.email,
                password: fakePassword
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

    after(async function () {

        const count = await User.find().count()

        if (count > 0) {
            //await User.deleteMany()
            await User.syncIndexes()
        }
    })
});