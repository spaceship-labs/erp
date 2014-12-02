/**
 * SalesQuoteController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var moment = require('moment');
module.exports = {
    edit: function(req,res){
    	var id = req.param('id');
        var company = req.session.select_company || req.user.select_company;
    	SaleQuote.findOne({id:id}).populateAll().exec(function(err,quote){
            if(err) throw err;
            Product.find({company : company}).populateAll().exec(function(err,products){
                if(err) throw err;
                if(products){
                    for(var i=0;i<products.length;i++){
                        products[i].quantity = 1;
                    }
                }
                Product_type.find().populateAll().exec(function(err,product_types){
                    var select_company = req.session.select_company || req.user.select_company;
                    Installation_crane.find({ company : select_company }).exec(function (err,installation_cranes){
                        Installation_material.find({ company : select_company }).populate('product').exec(function (err,installation_materials){
                                Installation_tool.find({ company : select_company }).populate('product').exec(function (err,installation_tools){
                                    Installation_work_type.find({ company : select_company }).exec(function (err,installation_work_types){
                                        Installation_zone.find({ company : select_company }).exec(function (err,installation_zones){
                                            Installation_hour.find({company : select_company}).exec(function(err,installation_hours){
                                                if(err) throw err;
                                                Common.view(res.view,{
                                                    page:{
                                                        description:'editar'
                                                        ,icon:'fa fa-database'
                                                        ,name:'Cotizacion '
                                                        ,controllers : 'product.js,installation.js'
                                                    },
                                                    moment:moment
                                                    ,quote:quote
                                                    ,products:products
                                                    ,product_types:product_types
                                                    ,cranes : installation_cranes || []
                                                    ,materials : installation_materials || []
                                                    ,tools : installation_tools || []
                                                    ,work_types : installation_work_types || []
                                                    ,zones : installation_zones || {}
                                                    ,hours : installation_hours || {}
                                                },req);
                                            });
                                        });
                                    });
                                });
                        });
                    });
                });

            });
	    });
    }

    , index: function(req,res){
	   	SaleQuote.find().populateAll().exec(function(err,quotes){
            //console.log(quotes[0].products);
            if(err) throw err;
			Common.view(res.view,{
                page:{
                    description:'listado de cotizaciones'
                    ,icon:'fa fa-database'
                    ,name:'Cotizaciones'
                },
				quotes:quotes
				,moment:moment
                ,client : {}
			},req);				
	   	});
    }
    , add: function(req,res){
        var form = req.params.all();
        var company = req.session.select_company || req.user.select_company;
        SaleQuote.create({
            user:   req.user.id
            ,client:    form.client
            ,company : company
        }).exec(function(err,quote){
            if(err) return res.json({
                msg:'ocurrio un error'
            });
            res.json({
                url:'/SalesQuote/edit/'+quote.id
            });
        }); 
    }
    
    , addProduct: function(req,res){
        var form = req.params.all();
        SaleProduct.create(form.product).exec(function(err,saleProduct){
            if(err) return res.json(false);
            res.json(true);
        });
    }

    ,removeProduct : function(req,res) {
        var form = req.params.all();
        SaleProduct.destroy({id : form.product}).exec(function(err){
            if (err) return res.json(false);
            res.json(true);
        });
    }

    ,editProduct : function(req,res) {

    }
};
