const supertest = require('supertest');
const app = require('../app.js');

describe("API route test", function() {
    it("GET / should has status code 200", function(done) {
        supertest(app)
            .get("/")
            .expect(200)
            .end(function(err, res){
                if (err) done(err);
                done();
            });
    });
    it("GET /login-code gives the correct response when login code is invalid", function(done) {
        supertest(app)
            .get("/login-code?loginCode=123")
            .expect({isValid: false})
            .end(function(err, res){
                if (err) throw err;
                done();
            });
    });
    it("GET /login-code gives the correct response when login code is valid", function(done) {
        supertest(app)
            .get("/login-code?loginCode=CS408")
            .expect({isValid: true})
            .end(function(err, res){
                if (err) throw err;
                done();
            });
    });
});
