require("../bootstrap.test.js")
var request = require('supertest');
var agent = request.agent;
var user;

describe('CompanyController', function() {
  describe('unauthenticated ClientController', function() {
    it('should redirect to /entrar if not authenticated', function (done) {
      request(sails.hooks.http.app)
        .get('/company')
        .expect(302)
        .expect('Location', '/entrar')
        .end(done);
    });
  });
  describe('authenticated ClientController', function() {
    before(function(done) {
      user = agent(sails.hooks.http.app);
      user
        .post('/session/auth')
        .send({ username: 'admin@admin.com', password: 'admin123' })
        .end(function (err, res) {
          done();
        });
    });
    it('should succeed for authenticated request', function (done) {
      User.find().exec(function(err, users) {
        user
          .get('/company')  
          .expect(200, done);
      });
    });
  });
});