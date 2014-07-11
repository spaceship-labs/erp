/**
* Product.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
	product_type:{
		model:'product_type'
	},
      saleQuotes : {
          collection : "SaleQuote",
          via : "products",
          through: 'salequoteproducts'
      }

  }
};

