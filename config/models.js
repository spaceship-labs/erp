/**
 * Models
 * (sails.config.models)
 *
 * Unless you override them, the following properties will be included
 * in each of your models.
 */

module.exports.models = {
 
  // Your app's default connection.
  // i.e. the name of one of your app's connections (see `config/connections.js`)
  //
  // (defaults to localDiskDb)
  connection: 'mongodb',
  migrate: 'safe',
  attributes : {
  	updateAvatar : function(req,opts,cb){
  		object = this;
  		Files.saveFiles(req,opts,function(e,files){
        file = files[0];
  			opts.filename = file.filename;
  			Files.makeCrops(req,opts,function(e,crops){
  				if(e) throw(e);
  				object.icon = file;
  				object.save(cb);
  			});
  		});
  	},
  	addFiles : function(req,opts,cb){
  		var async = require('async');
      object = this;
  		objectFiles = object.files ? object.files : [];
  		Files.saveFiles(req,opts,function(e,files){
  			if(e) return cb(e,files);
        object.files = objectFiles;
        async.mapSeries(files,function(file,callback){
          objectFiles.push(file);
          opts.filename = file.filename;
          if(file.typebase == 'image')
            Files.makeCrops(req,opts,callback);
          else
            callback(null,file);
        },function(e,crops){
          if(e) return cb(e,crops);
          object.files = objectFiles;
          object.save(cb);
        });  			
  		});
  	},
    removeFiles : function(req,opts,cb){
      var async = require('async');
      var object = this;      
      var files = opts.files ? opts.files : [];
      files = Array.isArray(files) ? files : [files];
      async.map(files,function(file,callback){
        opts.file = JSON.parse(file);
        for(var i = 0;i<object.files.length;i++){
          if(object.files[i].filename == opts.file.filename){
            object.files.splice(i,1);
          }
        }
        Files.removeFile(opts,callback);
      },function(e,files){
        object.save(cb);
      });
    },
  }
};
