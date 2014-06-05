/**
 * UsersController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var bcrypt = require('bcrypt')
, moment = require('moment');

module.exports = {
	index: function(req,res){
		Apps.find().exec(function(err,apps){
			Common.view(res.view,{
				 apps:apps
			},req);
		});
	}

	, indexJson: function(req,res){
		var find = {}
		, select_company = req.session.select_company || req.user.select_company;
		find['companies.'+select_company] ={$exists:1};
		User.find(find).exec(function(err,users){
			var alphabets_company = []
			, index;

			
			for(var i=0;i<users.length;i++){
				if(users[i].name){
					index = users[i].name[0].toUpperCase();
					alphabets_company.push(index);
				}
			}
						
			Apps.find().exec(function(err,apps){
				res.json(
					alphabets_company
				);
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
		form.req = req;
		User.create(form).exec(function(err,user){
			if(err) return res.json(response);
			update.icon(req,{userId:user.id},function(err,file){
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
		Common.editAjax(req,res,update);
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
	icon: function(req,form,cb){
		Common.updateIcon(req,{
			form:form
			,dirSave : __dirname+'/../../assets/uploads/users/'
			,dirPublic:  __dirname+'/../../.tmp/public/uploads/users/'
			,Model:User
			,prefix:'177x171'
		},cb);
	}
	, apps:function(req,form,cb){
		var select_company = req.session.select_company || req.user.select_company
		, update = {};
		update[select_company] = form.apps || [];
		User.update({id:form.userId},{companies:update},function(err,users){
			if(err) return cb && cb(err);
			var tmp = users.length && users[0].companies[select_company];
			Apps.find({controller:{$in:tmp}}).exec(function(err,apps){	
				return cb && cb(err,apps);
			});
		});
	}
	
	, info:function(req,form,cb){
		Common.updateInfoProfile(req,{
			form:form
			,id:form.userId
			,Model:User
			,validate:['name','last_name','phone','email','active']
		},cb);
	}
};
