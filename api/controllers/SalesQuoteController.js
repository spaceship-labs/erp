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
                    if(err) throw err;
                    Common.view(res.view,{
                        moment:moment
                        ,quote:quote
                        ,products:products
                        ,product_types:product_types
                    },req);
                });
            });
	    });
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
        var company = req.session.select_company || req.user.select_company;
        SaleQuote.create({
            user:req.user.id
            ,client:form.clientID
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
};
