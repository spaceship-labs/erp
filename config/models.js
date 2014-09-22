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
  		opts.lastIcon = this.icon;
  		object = this;
  		Files.saveFile(req,opts,function(e,filename){
  			opts.fileName = filename.filename;
  			Files.makeCrops(req,opts,function(e){
  				if(e) throw(e);
  				object.icon = opts.fileName;
  				object.save(cb);
  			});
  		});
  	},
  	addFile : function(req,opts,cb){
  		object = this;
  		files = object.files ? object.files : [];
  		Files.saveFile(req,opts,function(e,filename){
  			opts.fileName = filename.filename;
  			var ext = filename.filename.split('.');
  			files.push({
  				filename : filename.filename,
  				ext : ext[ext.length-1],
  				name : filename.originalFilename,
          size : filename.size,
          type : filename.type,
  			});
  			object.files = files;
  			// Todo, Condicional que esto se ejecute solo en imagenes;
  			Files.makeCrops(req,opts,function(e){
  				if(e) throw(e);
          object.save(cb);
  			});
  		});
  	},
    removeFiles : function(req,opts,cb){
      object = this;      
      files = opts.files ? opts.files : [];
      files = Array.isArray(files) ? files : [files];
      files.forEach(function(file){
        opts.file = JSON.parse(file);
        Files.removeFile(opts);
        for(var i = 0;i<object.files.length;i++){
          if(object.files[i].filename == opts.file.filename){
            object.files.splice(i,1);
            //break;
          }
        }
        object.save(cb);
      });

    },
  }
};
