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
		Product.find().exec(function(err,products){
			if(err) throw err;
			var productsId = {}
			if(quote.products){
				for(var i=0;i<quote.products.length;i++){
					productsId[quote.products[i].product] = quote.products[i].quantity;
				}
			}
	    		Common.view(res.view,{
				moment:moment
				,quote:quote
				,products:products
				,productsId:productsId
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
            });
        }); 
    }
    
    , addProduct: function(req,res){
        var form = req.params.all();
        SaleQuote.findOne({id:form.quote}).populate('products').exec(function(err,saleQuote){
            if(err) return res.json(false);
            if(form.products && form.products.push){
                var productsInQuote = saleQuote.products && saleQuote.products.map(function(quote){return quote.product}) || []
                , productsInQuoteID = saleQuote.products && saleQuote.products.map(function(quote){return quote.id}) || []
                , addProducts = [];
                for(var i=0;i<form.products.length;i++){
                   if(form.products[i].select){
                        var temp;
                       if((temp = productsInQuote.indexOf(form.products[i].id))!=-1)
                            saleQuote.products.remove(productsInQuoteID[temp]);

                       addProducts.push({
                            product:form.products[i].id
                            ,quantity:form.products[i].count
                            ,price:form.products[i].price
                            ,name:form.products[i].name
                       });
                   }
                }
                addProducts.concat(saleQuote.products).forEach(function(d,i){
                    saleQuote.products.add(d);
                });
                saleQuote.save(function(err){
                    res.json(true);
                });
                
            }
        });
    }
};
