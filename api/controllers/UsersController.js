/**
 * UsersController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var fs = require('fs')
, bcrypt = require('bcrypt')
, moment = require('moment');

module.exports = {
	index: function(req,res){
		var find = {}
		, select_company = req.session.select_company || req.user.select_company;
		find['companies.'+select_company] ={$exists:1};
		User.find(find).exec(function(err,users){
			var alphabets_company = []
			, index;
			for(var i=0;i<users.length;i++){
				index = users[i].name[0].toUpperCase();
				alphabets_company.push(index);
			}
			
			
			Apps.find().exec(function(err,apps){
				Common.view(res.view,{
					 apps:apps
					, alphabets_company:alphabets_company
				},req);
			});
		});
	}

	, all: function(req,res){
		var find = {}
		, select_company = req.session.select_company || req.user.select_company;
		find['companies.'+select_company] ={$exists:1};
		User.find(find,{password:0}).exec(function(err,users){
			if(!err){
				for(var i=0;i<users.length;i++){
					users[i].createdAtString = timeFormat(users[i].createdAt);
					users[i].apps = users[i].companies[select_company]?users[i].companies[select_company].toString():[];
				}
				res.json(users);
			}
		})
	}

	, create: function(req,res){	
		var response = {
			status:false
			, msg:'ocurrio un error'
		}	
		, form = req.params.all() || {};
		form.id || delete form.id;
		form.active = 1;
		form.app_select = form.app_select || [];//null apps;
		if(!form.app_select.pop){
			form.app_select = [form.app_select];
		}

		var select_company = req.session.select_company || req.user.select_company;
		form.default_company = select_company;
		
		form.app_select.push('home');
		form.app_select.push('main');
		var tmp = {}
		tmp[select_company] = form.app_select.slice();
		form.companies = tmp;
		delete form.app_select;
		form.password = bcrypt.hashSync(form.password,bcrypt.genSaltSync(10));
		User.create(form).exec(function(err,user){
			if(err) return res.json(response);
			update.icon(req,res,{userId:user.id},function(err,file){
				if(err) return res.json(response);
				res.json({
					status:true
					, msg:'El usuario se creo exitosamente'
				});
				
			});
		});	
	}

	, edit: function(req,res){
		var id
		, select_company = req.session.select_company || req.user.select_company;
		if(id = req.params.id){
			User.findOne({id:id}).exec(function(err,user){
				if(err) return null;
				Apps.find().exec(function(err,apps){
					if(err) return ;
					user.apps = [];
					if(user.companies[select_company]){
						for(var i=0;i<apps.length;i++){
							if(user.companies[select_company].indexOf(apps[i].controller)!=-1){
								var tmp = {
									  name:apps[i].name
									, ctl:apps[i].controller
								}
							user.apps.push(tmp);
							}
						}
					}
					Common.view(res.view,{
					 	  user:user
						, select_company:select_company
						, apps:apps?apps:[]
					},req);			
				});
			});
		
		}
	}

	, editAjax: function(req,res){
		var form = req.params.all();
		if(form.userId){
			if(form.method in update)
				update[form.method](req,res,form,function(err,data){
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
	}
};

function timeFormat(date){
	date = moment(date);
	var now = moment();
	if(now.diff(date,'days',true)<1){
		return date.lang('es').fromNow();
	}
	return date.lang('es').format('LLLL');
}

var update = {
	icon: function(req,res,form,cb){
		var dirSave = __dirname+'/../../assets/uploads/users/'
		, dirPublic = __dirname+'/../../.tmp/public/uploads/users/'
		files = req.file('icon_input')._files,
		fileName = new Date().getTime();
		if(files.length){
			var ext = files[0].stream.filename.split('.');
			if(ext.length){
				ext = ext[ext.length-1];
				fileName += '.'+ext;
			}
		}
		User.findOne({id:form.userId}).exec(function(err,user){
			if(err) return cb && cb(err);
			req.file('icon_input').upload(dirSave+fileName,function(err,files){
				if(err) return cb && cb(err);
				fs.unlink(dirSave+user.icon,function(){
					//silence warning if not exists.
				});
				User.update({id:form.userId},{icon:fileName},function(err,user){
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
	}
	, apps:function(req,res,form,cb){
		var select_company = req.session.select_company || req.user.select_company
		, update = {};
		update[select_company] = form.apps;
		User.update({id:form.userId},{companies:update},function(err,users){
			if(err) return cb && cb(err);
			var tmp = users.length && users[0].companies[select_company];
			Apps.find({controller:{$in:tmp}}).exec(function(err,apps){	
				return cb && cb(err,apps);
			});
		});
	}
	
	, info:function(req,res,form,cb){
		console.log(form);
        	var id = form.userId
		,validate = ['name','last_name','phone','email','active'];
		
		for(var i in form){
			if(validate.indexOf(i)==-1)
				delete form[i];

		}
		console.log(form);
		User.update({id:id},form).exec(function(err,user){
			console.log(user);
			if(user && form.active!=undefined){	
				user = {
					activeN:user[0].active?0:1
					,active:user[0].active?'Desactivar':'Activar'
				};
			}
			return cb && cb(err,user);
		});
	}
};
