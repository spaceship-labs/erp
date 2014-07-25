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
	    	Product.find().exec(function(e,products){
	    		Common.view(res.view,{
					products:products
					,moment:moment
					,quote:quote
				},req);	
	    	});
	    });
		/*var product = quote.products.map(function(product){return product.product})
		Product.find({id:product}).exec(function(err,products){
	    		
		});*/	
	
    }

    , index: function(req,res){
	   	SaleQuote.find().populateAll().exec(function(err,quotes){
			Common.view(res.view,{
				quotes:quotes
				,moment:moment			
			},req);				
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
