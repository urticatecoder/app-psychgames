const supertest = require('supertest');
const server = require('../server.js');

describe("GET /", function() {
    it("it should has status code 200", function(done) {
        supertest(server)
            .get("/")
            .expect(200)
            .end(function(err, res){
                if (err) done(err);
                done();
            });
    });
});
