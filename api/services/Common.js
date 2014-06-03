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

var fs = require('fs')
, im = require('imagemagick');
module.exports.updateIcon = function(req,opts,cb){
	var dirSave = opts.dirSave
	, dirPublic = opts.dirPublic
	, Model = opts.Model
	, form = opts.form
	, prefix = opts.prefix || false
	, files = req.file && req.file('icon_input')._files || []
	, fileName = new Date().getTime()
	, measuresIcon = ['80x80','50x50','184x73','177x171'];
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

			var lastIcon = user.icon;
			fs.unlink(dirSave+lastIcon,function(){
				//silence warning if not exists.
			});
			Model.update({id:form.userId},{icon:fileName},function(err,user){
				if(err) return cb && cb(err);
				measuresIcon.forEach(function(v){
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
								return cb && cb(null,prefix+fileName);
							}).on('error',function(){
								return cb && cb(true);
							});
						
						}
					});
					if(!prefix){
						return cb && cb(null,fileName);
					}
				});	
			});
		});
	});

};

module.exports.updateInfoProfile = function(req,opts,cb){
	var id = opts.id
	, validate = opts.validate || []
	, Model = opts.Model
	, form = opts.form;

	if(validate.length){
		validate.push('req');
		for(var i in form){
			if(validate.indexOf(i)==-1)
				delete form[i];
		}
	
	}
	Model.update({id:id},form).exec(function(err,m){
		if(m && form.active!=undefined){	
			m = {
				activeN:m[0].active?0:1
				,active:m[0].active?'Desactivar':'Activar'
			};
		}
		return cb && cb(err,m);
	});
};

module.exports.editAjax = function(req,res,update){
	var form = req.params.all();
	form.req = req;
	if(form.userId){
		if(form.method in update)
			update[form.method](req,form,function(err,data){
				var data = {
					 status: true
					,msg: 'actualizado'
					,data: data
				};
				if(err){
					data.status = false;
					data.msg = 'Ocurrio un error';
				}
				res.json(data);
			});
	}
	
};
var moment = require('moment');
module.exports.noticeSuscribe = function(req,find,cb){
	if(req.isSocket)
		req.socket.join('notices')

	var prefix = {
		Usuarios:'el'
		,Empresas:'la'
	}
	Notice.find({
		$query:find,orderby:{updatedAt:-1}
	}).exec(function(err,notices){
		if(err) return cb && cb(err);
		var users = []
		, apps = []
		, modify = [];
		for(var i=0;i<notices.length;i++){
			users.push(notices[i].userId);
			apps.push(notices[i].app);
			notices[i].date = moment(notices[i].createdAt).lang('es').fromNow();
			modify.push({
				id:notices[i].modifyId
				,model:notices[i].model
			});
		}
		User.find({id:users},{password:0}).exec(function(err,users){
			if(err) return cb && cb(err);
			var us = {};
			for(var i=0;i<users.length;i++){
				delete users[i].password;
				us[users[i].id] = users[i];
			}
			Apps.find({controller:apps}).exec(function(err,apps){
				if(err) return cb && cb(err);
				var ap = {};
				for(var i=0;i<apps.length;i++){
					apps[i].prefix = prefix[apps[i].name];
					apps[i].single = apps[i].name.replace(/s$/,"");
					ap[apps[i].controller] = apps[i];
				}
				return cb && cb(err,{
					noticesN:notices
					,usersN:us
					,appsN:ap
					,modifyN:modify
				});
			});
		});
	});
};
