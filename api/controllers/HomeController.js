/**
 * HomeController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var passport = require('passport');
module.exports = {
	login: function(req,res){
		res.view({
			layout:null
		});
	}

	, logout: function(req,res){
		req.logout();
		res.redirect('/home/login');	
	}

	, auth: passport.authenticate('local',{
						    successRedirect: '/home/'
		                                   ,failureRedirect: '/home/login'
						   ,failureFlash: true
					   })

	, index: function(req,res){
		Common.view(res.view,{
			page:{
				icon:'iconfa-home'
				,name:'Tablero'
			}
		},req);
	}
	//notices
	, noticeSuscribe: function(req,res){
		if(req.isSocket){
			req.socket.join('notices')
			Notice.find({
				$query:{},orderby:{updatedAt:-1}
			}).exec(function(err,notices){
				var users = []
				, apps = []
				, modify = [];
				for(var i=0;i<notices.length;i++){
					users.push(notices[i].userId);
					apps.push(notices[i].app);
					modify.push({
						id:notices[i].modifyId
						,model:notices[i].model
					});
				}
				User.find({id:users},{password:0}).exec(function(err,users){
					var us = {};
					for(var i=0;i<users.length;i++){
						delete users[i].password;
						us[users[i].id] = users[i];
					}
					Apps.find({controller:apps}).exec(function(err,apps){
						var ap = {};
						for(var i=0;i<apps.length;i++){
							ap[apps[i].controller] = apps[i];
						}
						res.json({
							notices:notices
							,users:us
							,apps:ap
							,modify:modify
						});
					});
				});
			});
		}
	}
	,noticeModifyInfo: function(req,res){
		var info = req.params.all()
		, Model = sails.models[info.model];
		if(Model){
			Model.findOne({id:info.mId}).exec(function(err,model){
				if(err) return res.json(false);
				res.json({
					id:info.mId
					,info:model
					,model:info.model
				});
			});
		}else
			res.json(false);
	}
};
