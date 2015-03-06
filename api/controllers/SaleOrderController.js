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
        SaleOrder.findOne({id:id}).populateAll().exec(function(err,order){
            if(err) throw err;
            var asyncTasks = [];
            var machinesR = [];
            var clients = [];
            var quote = {};

            asyncTasks.push(function(cb) {
                Machine.find({company : select_company}).populate('modes').exec(function(err,machines) {
                    if(err) throw err;
                    machinesR = machines;
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

            asyncTasks.push(function(cb){
                SaleQuote.findOne({id : order.quote.id }).populateAll().exec(function(err,quoteR){
                    if(err) throw err;
                    //console.log(quoteR);
                    quote = quoteR;
                    cb();
                });
            });

            async.parallel(asyncTasks,function(){
                Common.view(res.view,{
                    page:{
                        description:'editar'
                        ,icon:'fa fa-barcode'
                        ,name:'Orden de trabajo '
                        ,controllers : 'product.js,installation.js,sale.js'
                    },
                    breadcrumb : [
                        {label : 'Ordenes', url : '/saleOrder/'},
                        {label : quote.name}
                    ],
                    moment : moment
                    ,order : order
                    ,quote : quote
                    ,machines : machinesR || {}
                    ,clients : clients || {}
                },req);
            });

        });
    }

    , index: function(req,res){
	   	SaleOrder.find().populateAll().exec(function(err,orders){
            //console.log(quotes[0].products);
            if(err) throw err;
			Common.view(res.view,{
                page:{
                    description:'listado de ordenes de trabajo'
                    ,icon:'fa fa-barcode'
                    ,name:'Ordenes de trabajo'
                    ,controller : 'sale.js'
                },
                orders:orders
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
    },

    configure : function(req,res) {
        var company = req.session.select_company || req.user.select_company;
        SaleOrderConfig.findOne({ company : company }).exec(function(err,config){
            if(err) return console.log(err);
            Common.view(res.view,{
                page:{
                    description:'configuracion para las ordenes de trabajo'
                    ,icon:'fa fa-gears'
                    ,name:'Configuracion'
                    ,controller : 'sale.js'
                },
                config:config
                ,moment:moment
                ,client : {}
            },req);
        });
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
