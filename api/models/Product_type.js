/**
* Product_type.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		name:'string'
		,sales_type:{
            model : 'Sales_type'
        }
		,fields:'array'
		,company:'string'
		,user:{
            model : 'User'
        }
		,description:'string'
		,product:{
			collection:'product'
			,via:'product_type'
		}

	}
};
