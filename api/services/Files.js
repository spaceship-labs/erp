var fs = require('fs'),
im = require('imagemagick'),
adapterPkgCloud = require('skipper-pkgcloud');

//Names and Saves a File returns de filename
module.exports.saveFiles = function(req,opts,cb){
	var dirSave = __dirname+'/../../assets/uploads/'+opts.dir+'/';
	var $files = req.file && req.file('file')._files || [],
	maxBytes = 22020096;//max 21mb.
	if($files.length){
		if(req._fileparser.form.bytesExpected>=maxBytes){
			//cb(new Error('exceeds maxBytes')); //throw en controllers
			cb(false,[]);
		}
		var fFiles = [];
		//async.map($files, function(file, async_cb) {
			//console.log('file');
			//console.log(file);
		var uploadOptions = {	
			saveAs:makeFileName,
			dirname:dirSave,
			onProgress:(req.onProgress && req.onProgress.fileProgress || null),
			maxBytes:52428800		
		};
		if(process.env.CLOUDUSERNAME){
			uploadOptions.adapter = adapterPkgCloud;
			uploadOptions.username = process.env.CLOUDUSERNAME;
			uploadOptions.apiKey = process.env.CLOUDAPIKEY;
			uploadOptions.region = process.env.CLOUDREGION;
			uploadOptions.container = process.env.CLOUDCONTAINER;
			uploadOptions.dirname = '/uploads/' + opts.dir + '/';
		}
		req.file('file').upload(
			uploadOptions,
			function(e,files){
				if(e) return cb(e,files);
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
		/*},function(err,files){
			cb(e,fFiles);
		});*/
		/*req.file('file').upload({saveAs:makeFileName,dirname:dirSave,onProgress:(req.onProgress && req.onProgress.fileProgress || null),maxBytes:52428800},function(e,files){
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
		});*/
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
        //console.log(size);
        //console.log(opts);
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

