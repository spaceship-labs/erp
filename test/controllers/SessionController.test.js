require("../bootstrap.test.js")
var request = require('supertest');

describe('SessionController', function() {
  it('should redirect to /entrar', function (done) {
    request(sails.hooks.http.app)
      .get('/entrar')
      .expect(200, done);
  });
  it('should authenticate', function (done) {
    User.find().exec(function(err, users) {
      request(sails.hooks.http.app)
          .post('/session/auth')
          .send({ username: users[0].email, password: 'admin123' })
          .expect(302)
          .expect('Location', '/')
          .end(done);
    });
  });
});