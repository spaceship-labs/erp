var fs = require('fs')
, im = require('imagemagick');
//Names and Saves a File returns de filename
module.exports.saveFiles = function(req,opts,cb){
	var dirSave = __dirname+'/../../assets/uploads/'+opts.dir+'/';
	var files = req.file && req.file('file')._files || [];
	if(files.length){
		req.file('file').upload({saveAs:makeFileName,dirname:dirSave},function(e,files){
			if(e) return cb(e,files);
			var fFiles = [];
			files.forEach(function(file){
				var filename = file.fd.split('/');
				filename = filename[filename.length-1];
				var typebase = file.type.split('/');
				fFiles.push({
		            filename : filename,
		            name : file.filename,
		            type : file.type,
		            size : file.size,
		            typebase : typebase[0],
	          	});
			});
			cb(e,fFiles);			
		});
	}else{
		return cb(true,false);
	}
	
}
var makeFileName = function(_stream,cb){
	var ext = _stream.filename.split('.');
	var fileName = new Date().getTime().toString()+Math.floor(Math.random()*10000000).toString();
	if(ext.length){
		ext = ext[ext.length-1];
		fileName += '.'+ext;
	}
	cb(null,fileName);
}
//Makes crops acording to a profile defined in config/images.js
module.exports.makeCrops = function(req,opts,cb){
	var async = require('async');
	var sizes = sails.config.images[opts.profile];
	opts.dirSave = __dirname+'/../../assets/uploads/'+opts.dir+'/';
	opts.dirPublic = __dirname+'/../../.tmp/public/uploads/'+opts.dir+'/';
	async.mapSeries(sizes,function(size,callback){
		Files.makeCrop(size,opts,callback);
	},cb);
}
//Makes individual Crop
module.exports.makeCrop = function(size,opts,cb){
	//Todo make delete crops function
	//if(opts.lastIcon) fs.unlink(opts.dirSave+size+opts.lastIcon,function(){});
	var wh = size.split('x')
	, opts2 = {
		srcPath:opts.dirSave+opts.filename
		,dstPath:opts.dirSave+size+opts.filename
		,width:wh[0]
		,height:wh[1]
	}
	im.crop(opts2,function(err,stdout,stderr){
		if(err) return cb && cb(err);
		var route = opts.dirSave+size+opts.filename;
		fs.createReadStream(route).pipe(fs.createWriteStream(opts.dirPublic+size+opts.filename))
		.on('finish',function(){
			return cb && cb(null,{route:route,size:size});
		}).on('error',function(){
			console.log('error with the crop');
			return cb && cb(null,false);
			//return cb && cb(true);
		});
	});
}
//Deletes a File and Crops if profile is specified;
module.exports.removeFile = function(opts,cb){
	var dirSave = __dirname+'/../../assets/uploads/'+opts.dir+'/';
	var sizes = opts.profile ? sails.config.images[opts.profile] : [];
	var filename = opts.file.filename;
	var async = require('async');
	var routes = [dirSave+filename];
	if(opts.file.typebase == 'image') sizes.forEach(function(size){routes.push(dirSave+size+filename);});
	async.map(routes,fs.unlink,cb);
}