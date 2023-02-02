const chai = require('chai')
const assert = chai.assert
const chaiHttp = require('chai-http')
const app = require('../index')
const bcrypt = require('bcrypt')
const User = require('../src/models/User')
chai.use(chaiHttp);

describe('when the client try to log in /users/login', () => {

    before(`implement users in ${process.env.MONGODB_URI_TEST}`, async () => {


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
    
        User.insertMany(users, (err, docs) => {
           if(err) {
               console.error("Loading fixtures Users failed.", err)
               return
           }
    
           console.info(`${docs.length} Users fixtures added.`)
            
        })
    })

    it('should get its token', (done) => {
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
                done();
            })
    })

    after(async () => {

        const count = await User.find().count()

        if (count > 0) {
            await User.deleteMany()
            await User.syncIndexes()
        }
    })

});