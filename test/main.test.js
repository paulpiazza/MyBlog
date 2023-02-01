const chai = require('chai')
const assert = chai.assert
const chaiHttp = require('chai-http')
const app = require('../index')

chai.use(chaiHttp);

describe('when the client request root /', () => {
    it('should send a status 200', (done) => {
        chai
            .request(app)
            .get('/')
            .end((err, res) => {
                assert.equal(res.status, 200);
                done();
              })
    })
});