const supertest = require('supertest');
const app = require('../app.js');

describe("API route test", function () {
    it("GET / should has status code 200", function (done) {
        supertest(app)
            .get("/")
            .expect(200)
            .end(function (err, res) {
                if (err) done(err);
                done();
            });
    });
    it("GET /login-code gives the correct response when login code is valid", function (done) {
        supertest(app)
            .get("/login-code?loginCode=CS408")
            .expect({isValid: true, error: ''})
            .end(function (err, res) {
                if (err) throw err;
                done();
            });
    });
    it("GET /login-code gives the correct response when login code is empty", function (done) {
        supertest(app)
            .get("/login-code?loginCode=")
            .expect({isValid: false, error: 'ProlificID is empty.'})
            .end(function (err, res) {
                if (err) throw err;
            });

        supertest(app)
            .get("/login-code?")
            .expect({isValid: false, error: 'ProlificID is empty'})
            .end(function (err, res) {
                if (err) throw err;
                done();
            });
    });
});
