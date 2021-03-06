/**
 * HomeController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
module.exports = {

	index: function(req,res){
		//console.log(req.user);
		Common.view(res.view,{
			page:{
				description:req.__('sc_home_desc'),
				icon:'fa fa-th-large',
				name:req.__('sc_dashboard') ,
				controller:'dashboard.js'
			}
		},req);
	}

	, changeLang: function(req, res){
		var params = req.params.all();
		var lang = params.lang;

		req.session.lang = lang;
		req.setLocale(lang);
		res.redirect('/');
	}
	//notices
	, noticeSuscribeAll: function(req,res){
		getCompanies(req.session.passport.user.id,function(err,comp){
			Notifications.noticeSuscribe(req,{companyId:{$in:comp}},function(err,data){
				if(err) return res.json(false);
				res.json(data);
			});	
		});

	}

	, noticeSuscribeApp: function(req,res){
		var params = req.params.all();
		if(params.app){
			getCompanies(req.session.passport.user.id,function(err,comp){
				if(err) throw err;
				Notifications.noticeSuscribe(req,{companyId:{$in:comp},app:params.app},function(err,data){
					if(err) return res.json(false);
					res.json(data);
				});		
			});
		}else
			res.json(false);
	}

	,noticeSuscribeSingle: function(req,res){
		var params = req.params.all();
		if(params.modify){
			Notifications.noticeSuscribe(req,{modifyId:params.modify},function(err,data){
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
	,geocode : function(req,res){
		var params = req.params.all();
		Geocoding.geocode(params.location,function(e,results){
			if(e) console.log(e);
			res.json(results || []);
		});
	}
	,reverseGeocode : function(req,res){
		var params = req.params.all();
		Geocoding.reverseGeocode(params.location,function(e,results){
			if(e) console.log(e);
			res.json(results || []);
		});
	}
};

function getCompanies(id,cb){
	User.findOne(id).populate('companies').exec(function (err, user){
		var companies = [];
		if(user && user.companies)
			for(var i=0;i<user.companies.length;i++){
				companies.push(user.companies[i].id);
			}

		return cb && cb(err,companies);
	});
}
