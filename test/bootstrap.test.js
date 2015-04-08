var Sails = require('sails');
var Barrels = require('barrels');
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
      migrate: 'drop',
      connection: 'testing_mongodb'
    }
  }, function(err, sails) {
    app = sails;
    //done(err, sails);

    var barrels = new Barrels();
    barrels.populate(['currency'], function(err) {
      if (err) {
        console.log(err);
        return done(err);
      }
      barrels.populate(['company'], function(err) {
        if (err) {
          console.log(err);
          return done(err);
        }
        barrels.populate(['user'], function(err) {
          if (err) {
            console.log(err);
            return done(err);
          }
          barrels.populate(['useracl'], function(err) {
            if (err) {
              console.log(err);
              return done(err);
            }
            done(err, sails);
          });
        });
      });
    });
  });
});

after(function(done) {
  Sails.lower(done);
});
