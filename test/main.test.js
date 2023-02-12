const chai = require('chai')
const assert = chai.assert
const chaiHttp = require('chai-http')
const app = require('../index')

chai.use(chaiHttp);

describe('when the client request api docs swagger /api-docs', () => {
    it('should send a status 200', (done) => {
        chai
            .request(app)
            .get('/api-docs')
            .end((err, res) => {
                assert.equal(res.status, 200);
                done();
              })
    })
});