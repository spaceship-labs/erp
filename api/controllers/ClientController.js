/**
 * SaleController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var moment = require('moment');
module.exports = {

    index : function(req,res){
        var select_company = req.session.select_company || req.user.select_company;
        Client_.find({ company : select_company }).exec(function (err,clients){
            Common.view(res.view,{
                page:{
                    icon:'fa fa-users'
                    ,name:'Clientes'
                },
                clients : clients || []
            },req);
        });

    },

    add : function(req,res){
        Common.view(res.view,{
            page:{
                icon:'fa fa-users'
                ,name:'Cliente'
            }
        },req);
    },



    edit : function(req,res){
        var id = req.param('id');
        var company = req.session.select_company || req.user.select_company;
        if (id){
            Client_.findOne({id:id,company : company }).populate('sales').exec(function(err,client_){
                Common.view(res.view,{
                    page:{
                        icon:'fa fa-users'
                        ,name:'Editar Cliente'

                    },
                    client : client_ || []
		    ,moment:moment
                },req);
            });
        } else
            res.notFound();
    },

    update: function(req,res){
        var form = Common.formValidate(req.params.all(),['id','name','address','phone','rfc']);
        if(form){
            Client_.update({id:form.id},form).exec(function(err,client_){
                if(err) return res.json({text:'Ocurrio un error.'});
                res.json({text:'Cliente actualizado.'});
            });
        }
    },

    create : function(req,res){
        var form = Common.formValidate(req.params.all(),['name','address','phone','rfc']);
        if(form){
            form.user = req.user.id;
            form.company = req.session.select_company || req.user.select_company;
            Client_.create(form).exec(function(err,client_){
                if(err) return res.json({text:err});
                res.json({text:'Cliente creado.',url:'/clientes/editar/'+client_.id});
            });
        }
    },

    clientsJson: function (req, res) {
        var select_company = req.session.select_company || req.user.select_company;
        Client_.find({ company : select_company }).exec(function(err,sales){
            res.json(sales);
        });
    },

    quote: function(req,res){
    	var id = req.param('id');
    	SaleQuote.findOne({id:id}).populate('products').populate('sale').exec(function(err,quote){
		console.log(quote.sale.client);
		var product = quote.products.map(function(product){return product.product});
		Client_.findOne({id:quote.sale.client}).exec(function(err,client){
			Product.find({id:product}).exec(function(err,products){
		    		Common.view(res.view,{
					products:products
					,moment:moment
					,client:client
				},req);	
			});
		
		});
	});
    }

};
