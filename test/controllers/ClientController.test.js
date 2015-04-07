require("../bootstrap.test.js")
var request = require('supertest');
var agent = request.agent;
var user;

describe('ClientController', function() {
  describe('unauthenticated ClientController', function() {
    it('should redirect to /entrar if not authenticated', function (done) {
      request(sails.hooks.http.app)
        .get('/client')
        .expect(302)
        .expect('Location', '/entrar')
        .end(done);
    });
  });
  describe('authenticated administrator ClientController', function() {
    before(function(done) {
      user = agent(sails.hooks.http.app);
      user
        .post('/session/auth')
        .send({ username: 'admin@admin.com', password: 'admin123' })
        .end(function (err, res) {
          done();
        });
    });
    it('should succeed for authenticated request with permission', function (done) {
      User.find().exec(function(err, users) {
        user
          .get('/client')  
          .expect(200, done);
      });
    });
  });
  describe('authenticated user without permission for ClientController', function() {
    before(function(done) {
      user = agent(sails.hooks.http.app);
      user
        .post('/session/auth')
        .send({ username: 'admin@admin.com', password: 'admin123' })
        .end(function (err, res) {
          done();
        });
    });
    it('should fail for authenticated request without permission', function (done) {
      User.find().exec(function(err, users) {
        user
          .get('/client')  
          .expect(302)
          .expect('Location', '/entrar')
          .end(done);
      });
    });
  });
});