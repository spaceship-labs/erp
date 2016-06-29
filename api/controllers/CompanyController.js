/**
 * appsompanyController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var async = require('async'),
anchor = require('anchor');
module.exports = {
	index: function(req,res){
		Currency.find().exec(function(err,currencies){
			//Company.find().populate('base_currency').exec(function(err,companies){
				Common.view(res.view,{
					apps : sails.config.apps
                    ,isAgencies : true
					,currencies:currencies || []
					,page:{
						name:req.__('sc_companies')
						,icon:'fa fa-building'
						,controller : 'company.js'
					}
				},req);
			//});
		});
	}, providers : function(req,res){
        Currency.find({ company_type : { '!' : 'transport' } }).exec(function(err,currencies){
            //Company.find().populate('base_currency').exec(function(err,companies){
                Common.view(res.view,{
                    apps : sails.config.apps
                    ,select_view: 'company/index'
                    ,isAgencies : false
                    ,currencies:currencies || []
                    ,page:{
                        name:req.__('sc_companies')
                        ,icon:'fa fa-building'
                        ,controller : 'company.js'
                    }
                },req);
            //});
        });
    }, find : function(req,res){
        var params = req.params.all();
        var skip = params.skip || 0;
        var limit = params.limit || 200;
        if( typeof params.id == 'undefined' ) delete params.id;
        delete params.skip;
        delete params.limit;
        if(params.name) params.name = new RegExp(params.name,"i");
        //console.log(req.user);
        if( req.user.isAdmin || req.user.company.adminCompany ){
            Company.find(params).skip(skip).limit(limit).populate('currencies').exec(function(err,companies){
                Company.count(params).exec(function(e,count){
                    //res.json(companies);
                    res.json({ results : companies , count : count });
                });
            });
        }else{
            User.findOne(req.user.id).populate('companies',params).exec(function(err,user){
                res.json( user.companies );
            });
        }
    }, setasdefault : function(req,res){
        if( req.user.isAdmin ){
            var params = { adminCompany : true };
            Company.update({ id : req.user.default_company },params).exec(function(err,c){
                res.json(c);
            });
        }
    }, edit: function(req,res){
        var id = req.params.id;
	    if(!id) return res.notFound();
        Currency.find().exec(function(err, currencies){
            Company.findOne({id:id}).populate('users').populate('hotels').populate('taxes').populate('currencies').exec(function(err,company){
                //if(err) throw err;
                //console.log(company);
		if(err || !company) return res.notFound();
                User.find().exec(function(err,users){
                    Hotel.find().exec(function(err,hotels){
                        Common.view(res.view,{
                            mycompany:company || {}
                            ,users:users || []
                            ,hotels:hotels || []
                            ,currencies : currencies || []
                            ,apps: sails.config.apps
                            ,page:{
                                name:req.__('sc_companies')
                                ,icon:'fa fa-building'
                                ,controller : 'company.js'		
                            },
                            breadcrumb : [
                                {label : req.__('sc_companies'), url : '/company/'},
                                {label : company.name}
                            ],
                        },req);
                    });
                });
            }); //END company find
        });
	}
	, editAjax: function(req,res){
		Common.editAjax(req,res,update);
	}
    , addUser : function(req,res){
        Company.findOne({id:req.param('company')}).populate('users').exec(function(er,c){
            if (er) {
                console.log(er);
                throw er;
            }
            c.users.add(req.param('user'));

            c.save(function(err,su){
                if (err) {
                    throw err;
                }
                res.json(su);
            });
        });
    }
    , removeUser : function(req,res){
        Company.findOne({id:req.param('company')}).populate('users').exec(function(er,c){
            if (er) {
                console.log(er);
                throw er;
            }
            for(key in c.users){
                if (c.users[key].id == req.param('user')) {
                    c.users.remove(c.users[key].id);
                }
            }

            c.save(function(err,sc){
                if (err) {
                    throw err;
                }
                res.json(sc);
            });
        });
    }
    , addHotel : function(req,res){
        Company.findOne({id:req.param('company')}).populate('hotels').exec(function(er,c){
            if (er) {
                console.log(er);
                throw er;
            }
            c.hotels.add(req.param('hotel'));

            c.save(function(err,su){
                if (err) {
                    console.log(err);
                    throw err;
                }
                res.json(su);
            });
        });
    }
    , removeHotel : function(req,res){
        Company.findOne({id:req.param('company')}).populate('hotels').exec(function(e,c){
            if(e) throw(e);
            for(key in c.hotels){
                if (c.hotels[key].id == req.param('hotel')) {
                    c.hotels.remove(c.hotels[key].id);
                }
            }
            c.save(function(err) {
                res.json(c);
            });
        });
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
    	var form = req.params.all();
		Company.updateAvatar(req,{
			dir : 'companies',
			profile: 'avatar',
			id : form.id,
		},function(e,company){
			if(e) console.log(e);
			res.json(company);
		});
	}
    ,update : function(req,res) {
        //console.log(req.params.all());
        //var form = Common.formValidate(req.params.all(),['id','name','address','zipcode','description','terms','footer','company_type']);
        var form = Common.formValidate(req.params.all(),['id','name','address','zipcode','description','terms','footer','company_type', 'emails_contact', 'emails_billing','emails_reservation','base_currency','isActiveGlobalDiscount']);
        //console.log(form);
        Company.update({id : form.id},form).exec(function(err,company){
           if (err) {
               console.log(err);
               return res.serverError(err);
           }
           return res.json(company[0]);
        });
    }
    ,update_exchangerates : function(req,res){
        var params = req.params.all();
        var exchange_rates = params.exchange_rates
        Company.update({id:params.id},{exchange_rates:exchange_rates}).exec(function(err,company){
            if(err) return res.serverError(err);
            return res.json(company[0].exchange_rates);
        });
    }
    ,change : function(req,res) {
        var company = req.param('id');
        Company.findOne(company).populate('currencies').populate('base_currency').exec(function(e,scompany){
            req.user.select_company = scompany.id;
            req.user.company = scompany;
            req.session.select_company = scompany.id;
            ('Referer') || '/'
            var backURL = req.header('Referer') || '/';
            res.redirect(backURL);
        });
    },
    add_tax : function(req,res) {
        var form = Common.formValidate(req.params.all(),['name','value','company']);
        if (form) {
            Company_tax.create(form).exec(function(err,tax) {
                if (err) return res.json({text : err});
                res.json({ text : 'Impuesto guardado ',data : tax});
            });
        }
    },
    edit_tax : function(req,res) {
        var id = req.param('id');
        var company = req.session.select_company || req.user.select_company;
        if (id) {
            Company_tax.find({ id : id }).exec(function(err,contact) {
                if (err) return res.forbidden();
                Common.view(res.view,{
                    page:{
                        icon:'fa fa-building'
                        ,name:req.__('sc_taxedit')
                        ,controller : 'company.js'

                    },
                    breadcrumb : [
                        {label : req.__('sc_companies'), url : '/company/'},
                        {label : company.name , url : '/company/' + company.id},
                        {label : contact.name}
                    ],
                    contact : contact || []
                },req);
            });
        }
    },
    //TODO validaciones de taxes ya asociados
    delete_tax : function(req,res) {
        var id = req.param('id');
        if (id) {
            Company_tax.destroy({ id : id }).exec(function(err,tax) {
                if (err) return res.json({text : err});
                res.json(tax);
            });
        }
    },
    addFiles : function(req,res){
        var form = req.params.all(),
        invalid = anchor(form).to({
                        type:{
                            id: 'string',
                            field: 'string',
                            filename: 'string'
                        }
                    });
        if(invalid)
            return res.json(invalid);

        Company.findOne({id:form.id}).exec(function(e,company){
            if(e) return res.json({success: false});
                company.addFiles(req,{
                    dir : 'company/files',
                    profile: 'gallery'
                },function(e,comp){
                    if(e || !company || !company.files || !company.files.length) return res.json({success:false});
                    async.detect(company.files.reverse(), function(file, next){
                    next(file.name.trim() == form.filename.trim());
                }, function(file){
                    if(!file) return res.json({success:false});
                    var newField = {};
                    newField[form.field] = file;
                    Company.update({id:company.id}, newField).exec(function(err, companyUpdate){
                        if(err || !companyUpdate.length) return res.json({success:false});
                        var json = {};
                        json[form.field] = companyUpdate[0][form.field];
                        json.success = true;
                        res.json(json);
                    });
                });
            });
        });
    },
    gettransferprices : function(req,res){
        var params = req.params.all();
        Transferprices.getPricesbyCompany(params.company,params.transfer,params.type,function(err,prices){
            if(err) return res.json(false);
            res.json(prices);
        });
    },
    checkpriceexist : function(req,res){
        var params = req.params.all();
        Transferprices.ifPriceExist(params,function(err,ifPrice){
            res.json({err:err,result:ifPrice});
        });
    },
    newprice : function(req,res){
        var params = req.params.all();
        Transferprices.newPrice(params,function(err,price){
            res.json({err:err,result:price});
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
