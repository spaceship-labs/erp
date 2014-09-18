var fs = require('fs')
, im = require('imagemagick');
//Names and Saves a File
module.exports.saveFile = function(req,opts,cb){
	var dirSave = __dirname+'/../../assets/uploads/'+opts.dir+'/'
	, files = req.file && req.file('file')._files || []
	, fileName = new Date().getTime()+Math.floor(Math.random()*10000000)
	if(files.length){
		var ext = files[0].stream.filename.split('.');
		if(ext.length){
			ext = ext[ext.length-1];
			fileName += '.'+ext;
		}
		req.file('file').upload(dirSave+fileName,function(err,files){
			if(err) return cb && cb(err);
			fs.unlink(dirSave+opts.lastIcon,function(){});
			cb(null,fileName);
		});
	}else{
		return cb(true,false);
	}
	
}
module.exports.makeCrops = function(req,opts,cb){
	var sizes = sails.config.images[opts.profile];
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
}
module.exports.updateIcon = function(req,opts,cb){
	var dirSave = __dirname+'/../../assets/uploads/'+opts.dir+'/'
	, dirPublic = __dirname+'/../../.tmp/public/uploads/'+opts.dir+'/'
	, dirAssets = "/uploads/"+opts.dir+'/'
	, Model = opts.Model
	, form = req.params.all()
	, prefix = opts.prefix || false
	, files = req.file && req.file('file')._files || []
	, fileName = new Date().getTime()
	, sizes = sails.config.images[opts.profile];
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

};

function uploadAndCrop(){

}