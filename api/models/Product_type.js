/**
* Product_type.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var defaultFalse = {
	type:'boolean'
	,defaultsTo:false
};
module.exports = {

	attributes: {
		name:'string'
		,sales_type:'array'
		,fields:'array'
		,rent:defaultFalse
		,sale:defaultFalse
		,service:defaultFalse
		,company:'string'
		,user:'string'
		,description:'string'
		,product:{
			collection:'product'
			,via:'product_type'
		}

	}
};
