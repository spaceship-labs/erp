/**
 * UserController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var bcrypt = require('bcrypt')
, moment = require('moment');

module.exports = {
	index: function(req,res){
		var select_company = req.session.select_company || req.user.select_company;
		Company.findOne(select_company).populate('users').exec(function(e,company){
			if(e) throw (e);
			var users = company.users;
			var alphabets_company = [];
			for(var i=0;i<users.length;i++){
				users[i].createdAtString = timeFormat(users[i].createdAt);
				users[i].lastAccessString = users[i].lastAccess ? timeFormat(users[i].lastAccess) : 'nunca';
				users[i].avatar = users[i].icon ? '/uploads/users/'+users[i].icon : 'http://placehold.it/50x50';
				if(users[i].last_name){
					index = users[i].last_name[0].toUpperCase();
					alphabets_company.push(index);
				}
			}
			Common.view(res.view,{
				 apps: sails.config.apps,
				 users:users,
				 alphabet : alphabets_company
			},req);
		});			
	}

	, indexJson: function(req,res){
		/*var find = {}
		, select_company = req.session.select_company || req.user.select_company;
		find['companies.'+select_company] ={$exists:1};
		User.find(find).exec(function(err,users){
			var alphabets_company = []
			, index;

			
			
						
			Apps.find().exec(function(err,apps){
				res.json(
					alphabets_company
				);
			});
		});*/
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
		form.active = true;
		var select_company = req.session.select_company || req.user.select_company
		, password = form.password;
		form.default_company = select_company;
		form.req = req;
		form.name = form.user_name;
		delete form.password;
		delete form.user_name;
		Company.findOne({id:select_company}).exec(function(err,company){
			if(err) return res.json(response);
			User.create(form).exec(function(err,user){
				user.createAccessList(company.apps);
				if(err) return res.json(response);
				user.companies.add(company.id);
				user.setPassword(password);
				res.json({
					status:true
					, msg:'El usuario se creo exitosamente'
					, url:'/user/edit/'+user.id
				});
			});	
		});
	}

	, edit: function(req,res){
		var id
		, select_company = req.session.select_company || req.user.select_company;
		if(id = req.params.id){
			User.findOne(id).exec(function(err,user){
				if(err) return null;
				user.avatar = user.icon ? '/uploads/users/177x171'+user.icon : 'http://placehold.it/177x171';
				user.active = user.active?true:false;
				App.find().exec(function(err,apps){
					if(err) return;
					Common.view(res.view,{
					 	  user:user
						, select_company:select_company
						, apps:apps
					},req);					
				});
			});
		
		}
	}
	, editJson: function(req,res){
		var id
		, select_company = req.session.select_company || req.user.select_company;
		if(id = req.params.id){
			User.findOne({id:id}).exec(function(err,user){
				if(err) return null;
				Apps.find().exec(function(err,apps){
					if(err) return ;
					user.apps = [];
					var notApp = [];
					if(user.companies[select_company]){
						for(var i=0;i<apps.length;i++){
							if(user.companies[select_company].indexOf(apps[i].controller)!=-1){
								var tmp = {
									  name:apps[i].name
									, ctl:apps[i].controller
								}
								user.apps.push(tmp);
								notApp.push(tmp.ctl)
							}
						}
					}
					Apps.find({controller:{'!':notApp}}).exec(function(err,appNo){
						if(err) return res.json(false);
						res.json({
						 	  user:user
							, select_company:select_company
							, apps:appNo?appNo:[]
						});				
					});
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
			,dirAssets:'/uploads/users/'
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
	, accessList:function(req,form,cb){
		//console.log(form.accessList);
		User.update({id:form.userId},{accessList:form.accessList}).exec(function(err,user){
			if(err) return cb(err);
			return cb && cb(err,user);
		});

	} 
};
