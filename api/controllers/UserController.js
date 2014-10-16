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
				users[i].lastAccessString = users[i].lastLogin ? timeFormat(users[i].lastLogin) : 'nunca';
				users[i].avatar = users[i].icon ? '/uploads/users/'+users[i].icon : 'http://placehold.it/50x50';
				if(users[i].last_name){
					index = users[i].last_name[0].toUpperCase();
					alphabets_company.push(index);
				}
			}
			Common.view(res.view,{
				 apps: sails.config.apps,
				 users:users,
				 page:{
					name:'Usuarios'
					,icon:'fa fa-users'		
					,controller : 'user.js'		
				 }
			},req);
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
		var form = req.params.all() || {};
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
			if(err) return res.forbidden();
			User.create(form).exec(function(err,user){
				if(err) return res.forbidden();
				user.companies.add(company.id);
				user.setPassword(password);
                return res.redirect('/user/edit/'+user.id);
			});	
		});
	}
	, edit: function(req,res){
		var id
		, select_company = req.session.select_company || req.user.select_company;
		if(id = req.params.id){
			User.findOne(id).exec(function(err,user){
				if(err) return null;
				user.avatar2 = user.icon ? '/uploads/users/177x171'+user.icon : 'http://placehold.it/177x171';
				user.active = user.active?true:false;
					if(err) return;
					Common.view(res.view,{
					 	  user:user
						, select_company:select_company
						, apps:sails.config.apps
						, page:{
							name:'Usuarios'
							,icon:'fa fa-users'		
							,controller : 'user.js'		
						}
					},req);
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
								};
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
    ,updateInfo : function(req,res){
        var userId = req.param('userId');
        var form = {
            name : req.param('name'),
            last_name : req.param('last_name'),
            phone : req.param('phone'),
            email : req.param('email'),
            active : req.param('active')
        };

        if (userId && form) {
            User.update({ id : userId},form).exec(function(err,user){
               if (err) res.json({ text : err.message });
               res.json({text : 'perfil actualizado con exito'});
            });
        } else {
            res.forbidden();
        }
    }
	, updateIcon: function(req,res){
    	form = req.params.all();
		User.updateAvatar(req,{
			dir : 'users',
			profile: 'avatar',
			id : form.id,
		},function(e,user){
			if(e) console.log(e);
			res.json(formatUser(user));
		});
	}
    ,updatePassword : function(req,res){
        var userId = req.param('userId');
        var new_password = req.param('new_password');
        var old_password = req.param('old_password');

        if (userId) {
            User.findOne({ id : userId}).exec(function(err,user){
                if (err) res.json({ text : err.message });
                bcrypt.compare(old_password,user.password, function(err, resCompare) {
                    if (err || !resCompare) {
                        res.json({text : 'error contraseña invalida',resCompare : resCompare,err : err});
                        return;
                    }
                    user.setPassword(new_password);
                    User.update({id : userId},{ password : user.password }).exec(function(err,userAux){
                        if (err) res.json({text : 'error contraseña invalida',err : err});
                        res.json({text : 'perfil actualizado con exito!'});
                    });
                });
            });
        } else {
            res.forbidden();
        }
    }
};
function formatUser(user){
	user.active = user.active?true:false;
	return user;
}
function timeFormat(date){
	date = moment(date);
	var now = moment();
	if(now.diff(date,'days',true)<1){
		return date.lang('es').fromNow();
	}
	return date.lang('es').format('LLLL');
}

var update = {
	apps:function(req,form,cb){
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
