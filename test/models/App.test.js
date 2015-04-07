require("../bootstrap.test.js")

describe('App', function() {
  it ('should check find', function(done) {
    App.find().exec(function(err, apps) {
      apps.length.should.be.above(-1);
      done();
    });
  });
  it ('should not create app without name', function(done) {
    var params = {};
    App.create(params).exec(function(err,app){
      if (err) return done();
    });
  });
  it ('should create app', function(done) {
    var params = { name: 'sistema' };
    App.create(params).exec(function(err,app){
      if (err) throw err;
      done();
    });
  });
});