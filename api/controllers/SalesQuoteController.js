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
        var select_company = req.session.select_company || req.user.select_company;
    	SaleQuote.findOne({id:id}).populateAll().exec(function(err,quote){
            if(err) throw err;
            var asyncTasks = [];
            var machinesR = [];
            var installation_hoursR = [];
            var installation_zonesR = [];
            var installation_work_typesR = [];
            var installation_toolsR = [];
            var installation_materialsR = [];
            var installation_cranesR = [];
            var product_typesR = [];
            var productsR = [];
            var clients = [];

            asyncTasks.push(function(cb) {
                Machine.find({company : select_company}).populate('modes').exec(function(err,machines) {
                    if(err) throw err;
                    machinesR = machines;
                    cb();
                });
            });

            asyncTasks.push(function(cb){
                Installation_hour.find({company : select_company}).exec(function(err,installation_hours){
                    if(err) throw err;
                    installation_hoursR = installation_hours;
                    cb();
                });
            });

            asyncTasks.push(function(cb){
                Installation_zone.find({ company : select_company }).exec(function (err,installation_zones){
                    if(err) throw err;
                    installation_zonesR = installation_zones;
                    cb();
                });
            });

            asyncTasks.push(function(cb){
                Installation_work_type.find({ company : select_company }).exec(function (err,installation_work_types){
                    if(err) throw err;
                    installation_work_typesR = installation_work_types;
                    cb();
                });
            });

            asyncTasks.push(function(cb){
                Installation_tool.find({ company : select_company }).populate('product').exec(function (err,installation_tools){
                    if(err) throw err;
                    installation_toolsR = installation_tools;
                    cb();
                });
            });

            asyncTasks.push(function(cb){
                Installation_material.find({ company : select_company }).populate('product').exec(function (err,installation_materials){
                    if(err) throw err;
                    installation_materialsR = installation_materials;
                    cb();
                });
            });

            asyncTasks.push(function(cb){
                Installation_crane.find({ company : select_company }).exec(function (err,installation_cranes){
                    if(err) throw err;
                    installation_cranesR = installation_cranes;
                    cb();
                });
            });

            asyncTasks.push(function(cb){
                Product_type.find().populateAll().exec(function(err,product_types){
                    if(err) throw err;
                    product_typesR = product_types;
                    cb();
                });
            });

            asyncTasks.push(function(cb){
                Product.find({company : select_company}).populateAll().exec(function(err,products){
                    if(err) throw err;
                    if(products){
                        for(var i=0;i<products.length;i++){
                            products[i].quantity = 1;
                        }
                    }
                    productsR = products;
                    cb();
                });
            });

            asyncTasks.push(function(cb){
                Client_.find({company : select_company}).populateAll().exec(function(err,client_s){
                    if(err) throw err;
                    clients = client_s;
                    cb();
                });
            });

            async.parallel(asyncTasks,function(){
                Common.view(res.view,{
                    page:{
                        description:'editar'
                        ,icon:'fa fa-database'
                        ,name:'Cotizacion '
                        ,controllers : 'product.js,installation.js,sale.js'
                    },
                    breadcrumb : [
                        {label : 'Cotizaciones', url : '/salesQuote/'},
                        {label : quote.name}
                    ],
                    moment:moment
                    ,quote:quote
                    ,products:productsR
                    ,product_types:product_typesR
                    ,cranes : installation_cranesR || []
                    ,materials : installation_materialsR || []
                    ,tools : installation_toolsR || []
                    ,work_types : installation_work_typesR || []
                    ,zones : installation_zonesR || {}
                    ,hours : installation_hoursR || {}
                    ,machines : machinesR || {}
                    ,clients : clients || {}
                },req);
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
                    ,controller : 'sale.js'
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
            ,deliver_to : form.client
            ,bill_to : form.client
            ,company : company
            ,name : form.name || 'Cotizacion'
        }).exec(function(err,quote){
            if(err) return res.json({
                msg:'ocurrio un error'
            });
            res.json({
                url:'/SalesQuote/edit/'+quote.id
            });
        }); 
    }

    ,update_name : function(req,res) {
        var form = req.params.all();
        SaleQuote.update({ id : form.id},{ name : form.name }).exec(function(err,quotes){
            if (err) {
                return res.json({ success : false , text : 'error' , message : err});
            }
            return res.json({success : true});
        });
    }
    
    , addProduct: function(req,res){
        var form = req.params.all();
        form.product.user = req.user.id;
        form.product.type = 'product';
        console.log(form.product);
        SaleProduct.create(form.product).exec(function(err,saleProduct){
            if(err) {
                console.log(err);
                return res.json(false);
            }
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

    },

    updateStatus : function(req,res) {
        var form = req.params.all();
        if (form.id && form.status) {
            SaleQuote.findOne({id : form.id }).populateAll().exec(function(err,quote){
                if (err) {
                    console.log(err);
                    return res.json({ success : false,err : err,error : 'Error generico'});
                }
                if (quote.status == 'open' && form.status == 'close' && quote.products.length == 0) {
                    return res.json({ success : false,error : 'Necesita tener almenos un item cargado' });
                }
                quote.status = form.status;
                SaleQuote.update({id : quote.id },{ status : form.status }).exec(function(err,quotes){
                    if (err) {
                        console.log(err);
                        return res.json({ success : false,err : err,error : 'Error generico status update'});
                    }
                    var order = {
                        quote : quote.id,
                        assignedUser : req.user.id
                    };
                    SaleOrder.create(order).exec(function(err,order){
                        if (err) {
                            console.log(err);
                            return res.json({ success : false,err : err,error : 'Error generico orden de trabajo'});
                        }
                        SaleQuote.update({ id : quote.id },{ order : order }).exec(function(err,quotess){
                            return res.json({ success : true});
                        });
                    });
                });
            });

        }
    },

    updateAttribute : function(req,res) {
        var form = req.params.all();
        if (form.id) {
            var ar = {};
            ar[form.field] = form.value;
            SaleQuote.update({id : form.id },ar).exec(function(err,m){
                if (err) {
                    console.log(err);
                    return res.json({ success : false ,error : err });
                }
                console.log(m);
                return res.json({ success : true  });
            });
        }
    },

    toPdf : function(req,res) {
        var quoteID = req.params('id');
        SaleQuote.find({id : quoteID}).populateAll().exec(function(err,quote) {
            if (err) {
                console.log(err);
                res.notFound();
            }
            Common.view(res.view,{
                page:{
                    description:'editar'
                    ,icon:'fa fa-database'
                    ,name:'Cotizacion '
                    ,controllers : 'product.js,installation.js'
                },
                quote : quote
            });
        });
    }
};
