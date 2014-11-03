/**
* Product_type.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		name:{
            type : 'string',
            required : true
        }
		,sales_type:{
            model : 'Sales_type',
            required : true
        }
		,fields: {
            collection : 'custom_fields',
            via : 'product_type'
        }
		,company:{
            model : 'Company',
            required : true
        }
		,user:{
            model : 'User'
        }
		,description: {
            type : 'string'
        }
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
