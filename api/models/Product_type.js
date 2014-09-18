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
		,fields: {
            collection : 'custom_fields',
            via : 'product_type'
        }
		,company:'string'
		,user:{
            model : 'User'
        }
		,description:'string'
		,product:{
			collection:'product'
			,via:'product_type'
		},
        inventory_use : {
            type : 'boolean'
        },
        inventory_type : {
            type : 'string'
        },
        machines : {
            collection : 'Machine',
            via : 'product_types'
        }

	}
};
