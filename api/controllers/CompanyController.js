/**
 * CompanyController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	index: function(req,res){
		App.find().exec(function(err,apps){
			if(err) throw err;
			Currency.find().exec(function(err,currencies){
				Common.view(res.view,{
					apps:apps || []
					,currencies:currencies || []
				},req);
				
			});
		});
	}
	, indexJson:function(req,res){
		Company.find().exec(function(err,comp){
			res.json(comp);
		});
	}
	, edit: function(req,res){
		var id = req.params.id;
		Company.findOne({id:id}).exec(function(err,company){
			if(err) throw err;
			var find = {}
			find['companies.'+id] = {$exists:1};
			User.find(find).exec(function(err,users){	
				App.find({controller:{$in:company.app}}).exec(function(err,apps){
					App.find({controller:{'!':company.app}}).exec(function(err,allApps){
						Common.view(res.view,{
							company:company || {}
							, users:users || []
							,apps: apps||[]
							,allApps:allApps || []
						},req);
					});
				});
			});
		});
	}
	, create: function(req,res){
		var form = req.params.all() || {}
		, response = {
			status:false
			, msg:'ocurrio un error'
		};
		delete form.id;
		form.active = 1;
		form.req = req;
		Company.create(form).exec(function(err,company){
			if(err) return res.json(response);
			update.icon(req,{userId:company.id},function(err,files){				
				if(err)  return res.json(response);
				res.json({
					status:true
					, msg:'La compania se creo exitosamente'
				});
			});


		});
	}
	, editAjax: function(req,res){
		Common.editAjax(req,res,update);
	}
};

var update = {
	icon: function(req,form,cb){
		Common.updateIcon(req,{
			form:form
			,dirSave : __dirname+'/../../assets/uploads/companies/'
			,dirPublic:  __dirname+'/../../.tmp/public/uploads/companies/'
			,Model:Company
			,prefix:'177x171'
			,dirAssets:'/uploads/companies/'
		},cb);
		
	}
	, info:function(req,form,cb){
		Common.updateInfoProfile(req,{
			form:form
			,id:form.userId
			,Model:Company
			,prefix:'177x171'
			,validate:['name','address','zipcode','description','active']
		},cb);
	}
	, apps:function(req,form,cb){
		var apps = form.apps || [];
		Company.update({id:form.userId},{app:form.apps}).exec(function(err,company){
			if(err) return cb && cb(err);
			company = company.length && company[0];
			Apps.find({controller:{$in:company.app}}).exec(function(err,apps){
				return cb && cb(err,apps);
			});
		});
	}
};
