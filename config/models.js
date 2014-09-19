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
  		Images.saveFile(req,opts,function(e,filename){
  			opts.fileName = filename;
  			Images.makeCrops(req,opts,function(e){
  				if(e) throw(e);
  				object.icon = opts.fileName;
  				object.save(cb);
  			});
  		});
  	}
  }
  		/*;

  		
	if(files.length){
		var ext = files[0].stream.filename.split('.');
		if(ext.length){
			ext = ext[ext.length-1];
			fileName += '.'+ext;
		}
	}
	Model.findOne({id:form.objectId}).exec(function(err,object){
		if(err) return cb && cb(err);
		req.file('file').upload(dirSave+fileName,function(err,files){
			if(err) return cb && cb(err);

			var lastIcon = object.icon;
			fs.unlink(dirSave+lastIcon,function(){
				//silence warning if not exists.
			});
			Model.update({id:form.objectId},{icon:fileName,req:req},function(err,object){
				if(err) return cb && cb(err);
				sizes.forEach(function(v){
					fs.unlink(dirSave+v+lastIcon,function(){
						//silence warning if not exists.
					});
					
					var wh = v.split('x')
					, opts = {
						srcPath:dirSave+fileName
						,dstPath:dirSave+v+fileName
						,width:wh[0]
						,height:wh[1]
					}
					im.crop(opts,function(err,stdout,stderr){
						if(err) return cb && cb(err);
						if(prefix==v){
							fs.createReadStream(dirSave+v+fileName).pipe(fs.createWriteStream(dirPublic+v+fileName))
							.on('finish',function(){
								return cb && cb(null,object);
							}).on('error',function(){
								return cb && cb(true);
							});
						
						}
					});
					if(!prefix){
						return cb && cb(null,object);
					}
				});	
			});
		});
	});
  		cb(null,this);
  	}
  }*/
};
