require("../bootstrap.test.js")

describe('User', function() {
  it ('should check find', function(done) {
    User.find().exec(function(err, users) {
      users.length.should.be.above(-1);
      done();
    });
  });
  it ('should not create user without email', function(done) {
    var params = { name: 'juan' };
    User.create(params).exec(function(err,user){
      if (err) return done();
    });
  });
  it ('should create user', function(done) {
    var email = 'admin@admin.co' + Math.random().toString(36).substring(4);
    var params = { email: email, name: 'juan', password: 'admin123', isAdmin: true };
    User.create(params).exec(function(err,user){
      if (err) throw err;
      done();
    });
  });
  it ('should validate unique user email', function(done) {
    var email = 'admin@admin.co' + Math.random().toString(36).substring(4);
    var params = { email: email, name: 'juan', password: 'admin123', isAdmin: true };
    User.create(params).exec(function(err,user){
      if (err) throw err;
      User.create(params).exec(function(err,user){
        if (err) return done();
        throw "El sistema permitió duplicar correo electrónico"
      });
    });
  });
});

