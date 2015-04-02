var Sails = require('sails');
require('should');

before(function(done) {
  Sails.lift({
    log: {
      level: 'error'
    },
    adapters: {
      mongo: {
        module: 'sails-mongo',
        host: 'localhost',
        database: 'spaceerp',
      }
    }
 
  }, function(err, sails) {
    app = sails;
    done(err, sails);
  });
});

after(function(done) {
  Sails.lower(done);
});