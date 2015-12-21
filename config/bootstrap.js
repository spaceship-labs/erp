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

    //cb();
    //server.kill(function(err){
        cb();
    //});

    Files.getContainerLink();
};

//server = http.createServer(function(req, res){
//    res.end('loading ERP... ');
//}).listen(port, function(){
//});
//
//killable(server);
