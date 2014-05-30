/**
 * AdminController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var money = require('money');
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
		form.active = 1;
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

	, editAjax: function(req,res){
		Common.editAjax(req,res,update);
	}

	, currencies: function(req,res){
		var mon = money
		, select_company = req.session.select_company || req.user.select_company;
		Companies.findOne({id:select_company}).exec(function(err,comp){
			Exchange_rates.findOne({$query:{},orderby:{updatedAt:-1}}).where({
				or: [
					{companyId: select_company},
					{}
				]
				//, {createdAt:{$gte:new Date(2010,4,1),$lt:new Date()}}
			}).exec(function(err,Ex){
				Currency.find({currency_code:{$in:comp.currencies}}).exec(function(err,cs){
					mon.rates = Ex.rates;
					var data = {};
					for(var i=0;i<cs.length;i++){
						var current = cs[i];
						if(current.currency_code!=comp.base_currency){	
							var change = mon(1).from(comp.base_currency).to(current.currency_code).toFixed(6)
							, comission = comp.currency_comission && (change*(1+comp.currency_comission/100));
							data[current.name] = {
								change: change
								,name:current.name+" ("+current.currency_code+")"
								,postName:current.prefix+comission+current.suffix
								,comission:comp.currency_comission?true:false
								,code:current.currency_code
								,id:Ex.companyId || -1
							}
						}else{
							var current_currency = current.name+" ("+current.currency_code +")"
							, current_code = current.currency_code
						}
					}
					Common.view(res.view,{
						currencies:data
						,currency:current_currency
						,currencyCode:current_code
						,comissionVal:comp.currency_comission
						,allCurrencies:cs
					});	
				});
			});	
		});
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
	, currency:function(req,form,cb){
		console.log(form);
		var select_company = req.session.select_company || req.user.select_company
		, find = form.userId==-1?{}:{companyId:form.userId}
		Exchange_rates.findOne({$query:find,orderby:{updatedAt:-1}}).exec(function(err,ex){
			if(!(form.currency in ex.rates) || err)
				return cb && cb(err);
			ex.rates[form.currency] = form.rate;
			if(form.userId==-1){
				Exchange_rates.create({
					rates:ex.rates
					,companyId:select_company
				}).exec(function(err,ex2){
					return cb && cb(err,ex2);
				});
			
			}else{
				Exchange_rates.update({
						companyId:form.userId
					}
					,{
						rates:ex.rates
					}).exec(function(err,ex2){
						return cb && cb(err,ex2);	
					});	
			}
			
		});

	}
	, baseCurrency: function(req,form,cb){
		var select_company = req.session.select_company || req.user.select_company
		,validate = ['currency_comission','base_currency'];
		for(var i in form){
			if(validate.indexOf(i)==-1)
				delete form[i];
		}
		Companies.update({id:select_company},form).exec(function(err,comp){
			cb && cb(err,comp)	
		});
	}
};
