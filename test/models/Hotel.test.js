require("../bootstrap.test.js")

describe('Hotel', function() {
  it ('should check find', function(done) {
    Hotel.find().exec(function(err, hotels) {
      hotels.length.should.be.above(-1);
      done();
    });
  });
  it ('should not create hotel without name', function(done) {
    var params = { name: 'juan' };
    Hotel.create(params).exec(function(err,hotel){
      if (err) return done();
    });
  });
  it ('should create hotel', function(done) {
    Company.find().exec(function(err,companies){
      var params = { name: 'juan', company: companies[0].id };
      Hotel.create(params).exec(function(err,hotel){
        if (err) throw err;
        done();
      });
    });
  });
});