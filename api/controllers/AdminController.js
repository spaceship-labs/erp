/**
 * AdminController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var money = require('money')
, moment = require('moment');
module.exports = {
	 editAjax: function(req,res){
		Common.editAjax(req,res,update);
	}
	
	, currencies: function(req,res){
		sails.controllers.admin.currenciesJson(req,res,function(data){
			data = {
				page:{
					name:'Monedas'
					,icon:'fa fa-money'				
				}
				,preload:data
			};
			Common.view(res.view,data,req);		
		});
	}

	, currenciesJson: function(req,res,cb){
		var mon = money
		, select_company = req.session.select_company || req.user.select_company
		, response = {
			status:false
			, msg:'ocurrio un error'
		};
		Company.findOne({id:select_company}).populate('currencies').populate('base_currency').exec(function(err,comp){
			if(err) return res.json(response);
			Exchange_rates.find({
				$query:{},orderby:{updatedAt:-1}
			}).exec(function(err,Ex){
				for(var i=0;i<Ex.length;i++){
					var cId = Ex[i].companyId;
					if(!cId || cId==select_company){
						Ex = Ex[i];
						break;
					}
				}
				Currency.find().exec(function(err,cs){
					if(err) return res.json(response);
					mon.base = "USD";
					mon.rates = Ex.rates;
					var data = {}
					,noSelect = [];
					for(var i=0;i<cs.length;i++){
						var current = cs[i];
						if(comp.currencies.map(function(c){
							return c.id;
						}).indexOf(current.id)!=-1 || comp.base_currency.id==current.id){
							if(current.id!=comp.base_currency.id){	
								var change = mon(1).from(comp.base_currency.currency_code).to(current.currency_code).toFixed(6)
								, comission = comp.currency_comission && (change*(1+comp.currency_comission/100));
								data[current.name] = {
									change: change
									,name:current.name+" ("+current.currency_code+")"
									,postName:current.prefix+comission+current.suffix
									,comission:comp.currency_comission?true:false
									,code:current.currency_code
									,id:Ex.companyId || -1
								};
							}else{
								var current_currency = current.name+" ("+current.currency_code +")"
								, current_code = current.currency_code;
							}
						}else{
							noSelect.push(cs[i]);
						}
					}
					var tmp = {
						currencies:data||{}
						,currency:current_currency||"agrega moneda"
						,currencyCode:current_code||false
						,comissionVal:comp.currency_comission
						,allCurrencies:noSelect||[]
					
					};
					if(cb) return cb(tmp)
					res.json(tmp);
				});
			});	
		});
	}
	,chartsData: function(req,res){
		var select_company = req.session.select_company || req.user.select_company
		,response = false
		,mo = money;
		Company.findOne({id:select_company}).populate('currencies').populate('base_currency').exec(function(err,comp){
			if(err) return res.json(response);
			var data = {};
            if (typeof comp != 'undefined' && typeof comp.currencies != 'undefined') {
                for (var i = 0; i < comp.currencies.length; i++) {
                    if (comp.currencies[i].id != comp.base_currency.id)
                        data[comp.currencies[i].currency_code] = [];
                }
            }
			var nowMonth = moment().startOf("month")._d;
			

			Exchange_rates.find({
				$query:{
					companyId:select_company,updatedAt:{
						$gte:nowMonth
					}
				}
				,orderby:{
						updatedAt:1
					}
			}).exec(function(err,ex){
				if(err) return res.json(response);
				days = {};
				for(var i=0;i<ex.length;i++){
					days[ex[i].updatedAt.getDate()] = ex[i];
				
				}
				Exchange_rates.find({
					createdAt:{
						$gte:nowMonth
					}
					,companyId:{
						$exists:0
					}
				}).exec(function(err,allEx){
					if(err) return res.json(response);
					for(var i=0;i<allEx.length;i++){
						var d = allEx[i].createdAt.getDate()
						, add;
						if(!(d in days)){
							days[d] = allEx[i];
						}
					}
					for(var i in days){
						for(var l in data){
							mo.rates = days[i].rates;
							mo.base = "USD";
							data[l].push([days[i].updatedAt.getTime(),mo(1).from(comp.base_currency.currency_code).to(l)]);
						}
					
					}
					var response = [];
					for(i in data){
						response.push({
							label:i
							,data:data[i]
						});

					}
					res.json(response);
				});
			})
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
	, currency:function(req,form,cb){
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
		var select_company = req.session.select_company || req.user.select_company;
		Currency.findOne({currency_code:form.base_currency}).exec(function(err,currency){
			if(err) return res.json(false);
			var ob = {
				base_currency:currency.id
				,currency_comission:form.currency_comission
			};
			if(!form.currency_comission)
				delete ob.currency_comission;
			Company.update({id:select_company},ob).exec(function(err,comp){
				cb && cb(err,comp);
			});	
		});
	}
	,addCurrency: function(req,form,cb){
		update.editCurrency(req,form,'add',cb);
	}
	,removeCurrency: function(req,form,cb){
		update.editCurrency(req,form,'remove',cb);
	}
	,editCurrency: function(req,form,method,cb){
		var select_company = req.session.select_company || req.user.select_company;
		Company.findOne({id:select_company}).populate("currencies").exec(function(err,comp){
			Currency.findOne({currency_code:form.currency}).exec(function(err,currency){
				if(method=="remove"){
					comp.currencies.remove(currency);
				}else
					comp.currencies.add(currency);
				comp.save(function(err){
					cb && cb(err,comp);	
				});	

			});
		});
	}
};
