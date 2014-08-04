/**
 * Sale_Product.js
 *
 * @description :: Many to many quoted products
 * @docs		:: http://sailsjs.org/#!documentation/models
 *
 * realmente solo se usa como esqueleto , cuando se crea el saleQuote no se crean los saleProduct solo se agregan a una lista
 */

module.exports = {

    attributes: {

        product: {
            model: 'Product'
        },

        quantity: {
            type : "integer",
            min : 1,
            integer : true
        },

        price : {
            type : "float",
            required : true
        },

        saleQuote : {
            model : "SaleQuote"
        }
	
	,name:{
		type:'string'
	}

    }


};
