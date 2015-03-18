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
  updateAvatar : function(req,opts,cb){
    this.findOne({id:opts.id}).exec(function(e,obj){
      if(e) return cb && cb(e,obj);
      obj.updateAvatar(req,opts,cb);
    });
  },
  attributes : {
  	updateAvatar : function(req,opts,cb){
      var async = require('async');
  		object = this;
      opts.file = object.icon;
      async.waterfall([
        function(callback){
            //console.log('save files');
            Files.saveFiles(req,opts,callback);
        },
        function(files,callback){
          //console.log('crops');
          object.icon = files[0];
          opts.filename = object.icon.filename;
          Files.makeCrops(req,opts,callback)
        },
        function(crops,callback){
          //console.log('remove');
          if(opts.file) Files.removeFile(opts,callback);
          else callback(null,crops);
        },
      ],function(e,results){
        if(e) console.log(e);
        object.save(cb);
      });
  	},
  	addFiles : function(req,opts,cb){
  		var async = require('async');
      object = this;
  		objectFiles = object.files ? object.files : [];
		  req.onProgress = getOnProgress(req);
  		Files.saveFiles(req,opts,function(e,files){
        //console.log('files');console.log(files);console.log('files END');
  			if(e) return cb(e,files);
        object.files = objectFiles;
        async.mapSeries(files,function(file,async_callback){
          var callback = req.onProgress.nextElement(files,async_callback);
          objectFiles.push(file);
          opts.filename = file.filename;
          if(file.typebase == 'image')
            Files.makeCrops(req,opts,callback);
          else
            callback(null,file);
        },function(e,crops){
          if(e) return cb(e,crops);
          //console.log('objectFiles');console.log(objectFiles);console.log('objectFiles END');
          object.files = objectFiles;
          object.save(cb);
          return objectFiles;
        });  			
  		});
  	},
    removeFiles : function(req,opts,cb){
      var async = require('async');
      var object = this;      
      var files = opts.files ? opts.files : [];
      files = Array.isArray(files) ? files : [files];
      async.map(files,function(file,callback){
        opts.file = file;
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
  },
    afterCreate: function(val,cb){
        if(this.tableName != 'notice'){
            Notifications.after(this,val,'create');
        }
        cb();
    },
    afterUpdate: function(val,cb){
        if(this.tableName != 'notice'){
            Notifications.after(this,val,'update');
        }
        cb();
    },
    beforeUpdate:function(val,cb){
        if(this.tableName != 'notice'){
            Notifications.before(val,'update');
        }
        cb();
    },
    beforeCreate: function(val,cb){
        if(this.tableName != 'notice'){
            Notifications.before(val);
        }
        cb();
    }
};

function getOnProgress(req){
    var salt = 5,
    uid = req.param('uid'),
    index = req.param('index')
    indice = 1;
    //console.log( '---- uid: ' + uid + ' ---- index: ' + index );
    return{
        fileProgress:function(progress){
            var written = progress.written,
            total = progress.stream.byteCount*2,//time crops.
            porcent = (written*100/total).toFixed(2); 
            //console.log('porcent: ' + porcent + ' salt: ' + salt);
            //console.log('written');console.log(written);
            if(porcent >= salt){
                salt += salt;
                sails.io.sockets.emit(uid, {porcent: porcent,index:index});
            }
        }
        ,nextElement:function(files,cb){//de a 1 
            var size = files && files.length;
            return function(err){
                if(size){
                    var porcent =  100;
                    sails.io.sockets.emit(uid, {
                        porcent:porcent,
                        index:index,
                        file:files[0]
                    });
                    indice++;            
                }
                cb(err);
            }
        }
    };
}
