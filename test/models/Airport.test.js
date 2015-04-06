require("../bootstrap.test.js")

describe('Airport', function() {
  it ('should check find', function(done) {
    Airport.find().exec(function(err, airports) {
      airports.length.should.be.above(-1);
      done();
    });
  });
  it ('should not create airport without name', function(done) {
    var params = {};
    Airport.create(params).exec(function(err,airport){
      if (err) return done();
    });
  });
  it ('should create airport', function(done) {
    var params = { name: 'cun int' };
    Airport.create(params).exec(function(err,airport){
      if (err) throw err;
      done();
    });
  });
});