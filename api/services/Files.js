var fs = require('fs'),
im = require('imagemagick'),
adapterPkgCloud = require('skipper-pkgcloud'),
async = require('async'),
gm = require('gm'),//crops con streams.
gmIm = gm.subClass({imageMagick:true}),
mime  = require('mime'),
fileTypes2Crop = {
    'image/jpeg':true,
    'image/png': true,
    'image/gif': true
};

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

		if(process.env.CLOUDUSERNAME && !opts.disableCloud){
			uploadOptions.adapter = adapterPkgCloud;
			uploadOptions.username = process.env.CLOUDUSERNAME;
			uploadOptions.apiKey = process.env.CLOUDAPIKEY;
			uploadOptions.region = process.env.CLOUDREGION;
			uploadOptions.container = process.env.CLOUDCONTAINER;
			uploadOptions.dirname = '/uploads/' + opts.dir + '/';
			if(opts.avatar)
				uploadOptions.after = function(stream, filename, next){
					var lookup = mime.lookup(filename);
					if(!fileTypes2Crop[lookup])
						return next();

					opts.srcData = stream;
					opts.filename = filename;
					Files.makeCropsStreams(uploadOptions, opts, next);
				};
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
	opts.dirSave = opts.dirSave || __dirname+'/../../assets/uploads/'+opts.dir+'/';
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
	var adapter = getAdapterConfig();
	var dirSave = adapter?'/uploads/'+opts.dir+'/' : __dirname+'/../../assets/uploads/'+opts.dir+'/';
	var sizes = opts.profile ? sails.config.images[opts.profile] : [];
	var filename = opts.file.filename;
	var async = require('async');
	var routes = [dirSave+filename];

	
	if(opts.file.typebase == 'image') sizes.forEach(function(size){routes.push(dirSave+size+filename);});
	
	if(adapter){
		async.each(routes, adapter.rm, cb);
	}else{
		async.map(routes,fs.unlink,cb);
	}
}

//streams rackspace.
module.exports.makeCropsStreams = function(uploadOptions, opts, cb){
    var sizes = sails.config.images[opts.profile];
    var adapter = adapterPkgCloud(uploadOptions);
    opts.dirSave = '/uploads/'+opts.dir+'/';
    if(!sizes) return cb();

    async.each(sizes,function(size, next){ 
    	var wh = size.split('x');
        gmIm(opts.srcData)
        .resize(wh[0], wh[1])
        .stream(function(err, stdout, stderr){
            if(err) return next(err);
            stdout.pipe(adapter.uploadStream({dirSave:opts.dirSave, name: size+opts.filename }, next));
        });

    }, cb);
};

module.exports.containerCloudLink = '';
module.exports.getContainerLink = function(next){
    //run in bootstrap
    //or '' if not setting
    if(module.exports.containerCloudLink){ 
        if(next) return next(null, containerCloudLink);
        return containerCloudLink
    }


    var adapter = getAdapterConfig();
    if(adapter){
        adapter.getContainerLink(function(err, link){
            module.exports.containerCloudLink = link || '';
            //console.log('LINK',module.exports.containerCloudLink )
            if(next) return next(err, module.exports.containerCloudLink);
        });
    }else{
        module.exports.containerCloudLink = '';
        if(next) return next(null, module.exports.containerCloudLink);
        return module.exports.containerCloudLink;
    }

};

function getAdapterConfig(){
    if(process.env.CLOUDUSERNAME){
        var uploadOptions = {};
        uploadOptions.username = process.env.CLOUDUSERNAME;
        uploadOptions.apiKey = process.env.CLOUDAPIKEY;
        uploadOptions.region = process.env.CLOUDREGION;
        uploadOptions.container = process.env.CLOUDCONTAINER;
        return adapterPkgCloud(uploadOptions);
    }
    return false;
}

module.exports.middleware = function(req, res, next){
    if(req.url.indexOf('/uploads/') != 0 || Files.containerCloudLink == ''){
        next();
    }else{
        res.redirect(301, module.exports.containerCloudLink + req.url);
    }
};
