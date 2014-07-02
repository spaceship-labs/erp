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
				icon:'fa fa-th-large'
				,name:'Tablero'
			}
		},req);
	}
	//notices
	, noticeSuscribeAll: function(req,res){
		var comp = []
		, apps = [];
		for(var i in req.session.passport.user.companies){
			comp.push(i);
			apps = apps.concat(req.session.passport.user.companies[i])
		}

		Common.noticeSuscribe(req,{companyId:{$in:comp},app:{$in:apps}},function(err,data){
			if(err) return res.json(false);
			res.json(data);
		});

	}

	, noticeSuscribeApp: function(req,res){
		var params = req.params.all();
		if(params.app){
			var comp = [];
			for(var i in req.session.passport.user.companies){
				comp.push(i);
			}
			Common.noticeSuscribe(req,{companyId:{$in:comp},app:params.app},function(err,data){
				if(err) return res.json(false);
				res.json(data);
			});
		}else
			res.json(false);
	}

	,noticeSuscribeSingle: function(req,res){
		var params = req.params.all();
		if(params.modify){
			Common.noticeSuscribe(req,{modifyId:params.modify},function(err,data){
				if(err) return res.json(false);
				res.json(data);
			});		
			
		}else
			res.json(false);
	
	}

	,noticeModifyInfo: function(req,res){
		var info = req.params.all()
		, Model = sails.models[info.model];
		if(Model){
			Model.findOne({id:info.mId},{password:0}).exec(function(err,model){
				if(err) return res.json(false);
				res.json({
					id:info.mId
					,info:model
					,modelN:info.model
				});
			});
		}else
			res.json(false);
	}
};
