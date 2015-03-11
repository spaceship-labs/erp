var Sails = require('sails');

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
  // here you can clear fixtures, etc.
  Sails.lower(done);
});