require("../bootstrap.test.js")

describe('Company', function() {
  it ('should check find', function(done) {
    Company.find().exec(function(err, companies) {
      companies.length.should.be.above(-1);
      done();
    });
  });
  it ('should not create company without name', function(done) {
    var params = {};
    Company.create(params).exec(function(err,company){
      if (err) return done();
    });
  });
  it ('should create company', function(done) {
    var params = { name: 'juan' };
    Company.create(params).exec(function(err,company){
      if (err) throw err;
      done();
    });
  });
});