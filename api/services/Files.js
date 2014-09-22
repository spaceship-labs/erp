var fs = require('fs')
, im = require('imagemagick');
//Names and Saves a File returns de filename
module.exports.saveFile = function(req,opts,cb){
	var dirSave = __dirname+'/../../assets/uploads/'+opts.dir+'/'
	, files = req.file && req.file('file')._files || []
	, fileName = new Date().getTime().toString()+Math.floor(Math.random()*10000000).toString();
	if(files.length){
		var original = files[0].stream.filename;
		var ext = original.split('.');
		if(ext.length){
			ext = ext[ext.length-1];
			fileName += '.'+ext;
		}
		req.file('file').upload(dirSave+fileName,function(err,files){
			if(err) return cb && cb(err);
			if(opts.lastIcon) fs.unlink(dirSave+opts.lastIcon,function(){});
			cb(null,{filename:fileName,originalFilename:original});
		});
	}else{
		return cb(true,false);
	}
	
}
//Makes crops acording to a profile defined in config/images.js
module.exports.makeCrops = function(req,opts,cb){
	var dirSave = __dirname+'/../../assets/uploads/'+opts.dir+'/';
	var dirPublic = __dirname+'/../../.tmp/public/uploads/'+opts.dir+'/';
	var sizes = sails.config.images[opts.profile];
	var i = 1;
	sizes.forEach(function(v){
		if(opts.lastIcon) fs.unlink(dirSave+v+opts.lastIcon,function(){});		
		var wh = v.split('x')
		, opts2 = {
			srcPath:dirSave+opts.fileName
			,dstPath:dirSave+v+opts.fileName
			,width:wh[0]
			,height:wh[1]
		}
		im.crop(opts2,function(err,stdout,stderr){
			if(err) return cb && cb(err);
			fs.createReadStream(dirSave+v+opts.fileName).pipe(fs.createWriteStream(dirPublic+v+opts.fileName))
			.on('finish',function(){
				if(i++ == sizes.length) return cb && cb(null);
			}).on('error',function(){
				//TODO DEBUG
				//return cb && cb(true);
			});
		});
	});	
}