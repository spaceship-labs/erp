module.exports.view = function(view,data,req){
	data = data || {};
	data.page = data.page || {};
	Companies.find().exec(function(err,comp){
		data.companies = [];
		for(var i=0;i<comp.length;i++){
			var obj = {};
			obj.name = comp[i].name;
			obj.desc = comp[i].description;
			obj.url = '/main/select_company/'+comp[i].id;
			obj.icon = comp[i].icon;
			obj.id = comp[i].id;
			data.companies.push(obj);
		}
		
		data.active = data.active || req && req.options.controller;
		
		if(req && req.user && !data.page){//iconfa...
			data.page = {};
			Apps.findOne({controller:req.options.controller}).exec(function(err,app){
				data.page = app || {};
				view(data);	
			});
		}else
			view(data);	
	});	
};

var fs = require('fs');
module.exports.updateIcon = function(req,opts,cb){
	var dirSave = opts.dirSave
	, dirPublic = opts.dirPublic
	, Model = opts.Model
	, form = opts.form
	, files = req.file('icon_input')._files
	, fileName = new Date().getTime();
	if(files.length){
		var ext = files[0].stream.filename.split('.');
		if(ext.length){
			ext = ext[ext.length-1];
			fileName += '.'+ext;
		}
	}
	Model.findOne({id:form.userId}).exec(function(err,user){
		if(err) return cb && cb(err);
		req.file('icon_input').upload(dirSave+fileName,function(err,files){
			if(err) return cb && cb(err);
			fs.unlink(dirSave+user.icon,function(){
				//silence warning if not exists.
			});
			Model.update({id:form.userId},{icon:fileName},function(err,user){
				if(err) return cb && cb(err);

				fs.createReadStream(dirSave+fileName).pipe(fs.createWriteStream(dirPublic+fileName))
				.on('finish',function(){
					return cb && cb(null,fileName);
				}).on('error',function(){
					return cb && cb(true);
				});
			});
		});
	});

};
