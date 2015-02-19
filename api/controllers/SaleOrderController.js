/**
 * SalesQuoteController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var moment = require('moment');

module.exports = {
    edit: function(req,res){

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
