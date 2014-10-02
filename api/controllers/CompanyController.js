/**
 * appsompanyController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	index: function(req,res){
		Currency.find().exec(function(err,currencies){
			Company.find().populate('base_currency').exec(function(err,companies){
				Common.view(res.view,{
					apps : sails.config.apps
					,currencies:currencies || []
					,comp:companies
					,page:{
						name:'Empresas'
						,icon:'fa fa-building'		
						,controller : 'company.js'		
					}
				},req);				
			});
		});
	}
	, edit: function(req,res){
		var id = req.params.id;
		Company.findOne({id:id}).exec(function(err,company){
			if(err) throw err;
			var find = {};
			find['companies.'+id] = {$exists:1};
			User.find(find).exec(function(err,users){	
				Common.view(res.view,{
					company:company || {}
					,users:users || []
					,apps: sails.config.apps
					,page:{
						name:'Empresas'
						,icon:'fa fa-building'		
						,controller : 'company.js'		
					}
				},req);
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
		form.active = true;
		form.req = req;
		var currencies = form.currencies.pop?form.currencies:[form.currencies];
		delete form.currencies;
		Company.create(form).exec(function(err,company){
			if(err) return res.json(response);
			currencies.forEach(function(currency){
				company.currencies.add(currency);
			});
			company.save(function(err){
				if(err) return res.json(response);
				res.json({
					status:true
					, msg:'La compania se creo exitosamente'
					, url: '/company/edit/'+company.id
				});
			});
		});
	}
	, editAjax: function(req,res){
		Common.editAjax(req,res,update);
	}
	, addApp : function(req,res){
		Company.findOne({id:req.param('company')}).exec(function(e,c){
			if(e) throw(e);
			c.addApps([req.param('app')],function(e,c){
				if(e) throw e;
				res.json(c);
			});
		});
	}
	,removeApp : function(req,res){
		Company.findOne({id:req.param('company')}).exec(function(e,c){
			if(e) throw(e);
			c.removeApp([req.param('app')],function(e,c){
				if(e) throw e;
				res.json(c);
			});
		});
	}
	,updateIcon: function(req,res){
    	form = req.params.all();
		Company.updateAvatar(req,{
			dir : 'companies',
			profile: 'avatar',
			id : form.id,
		},function(e,company){
			if(e) console.log(e);
			res.json(company);
		});
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
