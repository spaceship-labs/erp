require("../bootstrap.test.js")
var request = require('supertest');

describe('SetupController', function() {
  it('should redirect if company exists', function (done) {
    Company.find({},function(e,c){
      if(c.length > 0) {
        request(sails.hooks.http.app)
          .get('/setup')
          .expect(302)
          .expect('location','/entrar', done);
      } else {
        request(sails.hooks.http.app)
          .get('/setup')
          .expect(200, done);
      }
    });
  });
});