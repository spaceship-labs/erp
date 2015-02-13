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
		Company.findOne({id:id}).populate('users').populate('taxes').exec(function(err,company){
			if(err) throw err;
            //console.log(company.taxes);
			User.find().exec(function(err,users){
				Common.view(res.view,{
					company:company || {}
					,users:users || []
					,apps: sails.config.apps
					,page:{
						name:'Empresas'
						,icon:'fa fa-building'		
						,controller : 'company.js'		
					},
                    breadcrumb : [
                        {label : 'Companias', url : '/company/'},
                        {label : company.name}
                    ],
				},req);
			});
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
                    c.users.splice(key,1);
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
        var form = Common.formValidate(req.params.all(),['id','name','address','zipcode','description','terms','footer']);
        Company.update({id : form.id},form).exec(function(err,company){
           if (err) {
               console.log(err);
               return res.serverError(err);
           }
           return res.json(company[0]);
        });
    }
    ,change : function(req,res) {
        var company = req.param('id');
        Company.findOne(company).populate('currencies').populate('base_currency').exec(function(e,scompany){
            req.user.select_company = scompany.id;
            req.user.company = scompany;
            req.session.select_company = scompany.id;
            res.redirect('/home');
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
                        ,name:'Editar Impuesto'
                        ,controller : 'company.js'

                    },
                    breadcrumb : [
                        {label : 'Companias', url : '/company/'},
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
