/**
 * AdminController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	index: function(req,res){
		Apps.find().exec(function(err,apps){
			Common.view(res.view,{
				apps:apps || []
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
		console.log(form);
		Companies.create(form).exec(function(err,company){
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
	, edit: function(req,res){
		var id = req.params.id;
		Companies.findOne({id:id}).exec(function(err,company){
			var find = {}
			find['companies.'+id] = {$exists:1};
			User.find(find).exec(function(err,users){	
				Apps.find({controller:{$in:company.app}}).exec(function(err,apps){
					Apps.find({controller:{'!':company.app}}).exec(function(err,allApps){
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

	,editAjax: function(req,res){
		Common.editAjax(req,res,update);
	}

};

var update = {
	icon: function(req,form,cb){
		Common.updateIcon(req,{
			form:form
			,dirSave : __dirname+'/../../assets/uploads/companies/'
			,dirPublic:  __dirname+'/../../.tmp/public/uploads/companies/'
			,Model:Companies
		},cb);
		
	}
	, info:function(req,form,cb){
		Common.updateInfoProfile(req,{
			form:form
			,id:form.userId
			,Model:Companies
			,validate:['name','address','zipcode','description','active']
		},cb);
	}
	, apps:function(req,form,cb){
		var apps = form.apps || [];
		Companies.update({id:form.userId},{app:form.apps}).exec(function(err,company){
			if(err) return cb && cb(err);
			company = company.length && company[0];
			Apps.find({controller:{$in:company.app}}).exec(function(err,apps){
				return cb && cb(err,apps);
			});
		});
	}
};
