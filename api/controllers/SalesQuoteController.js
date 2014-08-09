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
    	SaleQuote.findOne({id:id}).populateAll().exec(function(err,quote){
		var product = quote.products.map(function(product){return product.product});
			Product.find({id:product}).exec(function(err,products){
		    		Common.view(res.view,{
					products:products
					,moment:moment
					,quote:quote
				},req);	
			});
		
	});
    }

    , index: function(req,res){
	   	SaleQuote.find().populateAll().exec(function(err,quotes){
	   		Product.find(function(e,products){
				Common.view(res.view,{
					quotes:quotes
					,moment:moment
					,products:products
				},req);	
			}); 
	   	});
    }
    , add: function(req,res){
    	var form = req.params.all();
	SaleQuote.create({
		user:req.user.id
		,client:form.clientID
	}).exec(function(err,quote){
		if(err) return res.json({
				msg:'ocurrio un error'
			})
		res.json({
			url:'/SalesQuote/edit/'+quote.id
		})

	});
    
    }

};
