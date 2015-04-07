var Sails = require('sails');
var should = require('should');

before(function(done) {
  Sails.lift({
    log: {
      level: 'error'
    },
    adapters: {
      mongo: {
        module: 'sails-mongo',
        host: 'localhost',
        database: 'asdas',
      }
    },
    models: {
      connection: 'testing_mongodb',
    }
 
  }, function(err, sails) {
    app = sails;
    done(err, sails);
  });
});

after(function(done) {
  Sails.lower(done);
});
