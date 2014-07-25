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
    	SaleQuote.findOne({id:id}).populate('products').populate('sale').exec(function(err,quote){
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

    , index: function(req,res){
   	SaleQuote.find().populate('sale').exec(function(err,quotes){
		var clients = quotes.map(function(c){ return c.sale.client });
		Client_.find({id:clients}).exec(function(err,clients){
			Common.view(res.view,{
				quotes:quotes
				,clients:clients
				,moment:moment
			},req);	
		})
	}); 
    }
	
};
