/**
 * Bootstrap
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

var killable = require('killable'),
    server,
    http = require('http'),
    port = process.env.PORT || 1337;

module.exports.bootstrap = function (cb) {

  // It's very important to trigger this callack method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  CronJobs && CronJobs.init();

  if (process.env.USERID) {
      //esto es una copia de lo que se hace al loggearse en el archivo config/passport.js
      User.findOne(process.env.USERID).populate('companies',{sort:'createdAt',limit:20}).populate('accessList').exec(function(err,user){
        if (err || !user) {
            sails.log.warn('wrond USERID','checalo!');
            sails.config.erp_user = false;
            server.kill(function(err){
                cb();
            });
        } else {
            user.select_company = user.default_company;
            Company.findOne(user.select_company).populate('currencies').populate('base_currency').exec(function(e,company){
                if (e) {
                    sails.log.warn('usuario sin default_company ? thats weird','checalo!');
                    sails.config.erp_user = false;
                } else {
                    user.company = company;
                    sails.config.erp_user = user;
                }
                server.kill(function(err){
                    cb();
                });
            });
        }
      });
  } else {
      //cb();
      server.kill(function(err){
          cb();
      });
  }

    Files.getContainerLink();
};

server = http.createServer(function(req, res){
    res.end('loading ERP... ');
}).listen(port, function(){
});

killable(server);
