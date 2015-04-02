require("../bootstrap.test.js")
var request = require('supertest');

describe('HomeController', function() {
  describe('#login()', function() {
    it('should redirect to /home/login', function (done) {
      request(sails.hooks.http.app)
        .get('/home/login')
        .expect(200, done);
    });
  });
});