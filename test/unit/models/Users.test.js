var User = require('../../../api/models/User'),
    assert = require('assert');

describe('User Model', function () {
  describe('before the user is created', function () {
    it ('should hash the password', function (done) {
      User.beforeCreate({
        password: 'password'
      }, function (err, user) {
        assert.notEqual(user.password, 'password');
        done();
      });
    });
  });
});