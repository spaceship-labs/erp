	/**
* Product.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    company : { model : 'Company' },
	product_type:{
	    model:'product_type'
	},
    gallery:'array',
    fields : {
        collection : 'Custom_fields_value',
        via : 'product'
    },
    prices : {
        collection : 'Product_price',
        via : 'product'
    },
    price : {
        model : 'Product_price'
    },
    internalReference : 'string',
    name : 'string',
    description : 'string',
    barcode : 'string',
    quantity : 'integer'//TODO separar
  }

	,afterCreate: function(val,cb){
		Notifications.after(Product,val,'create');
		cb();
	}
	,afterUpdate: function(val,cb){
		Notifications.after(Product,val,'update');
		cb();
	}
	,beforeUpdate:function(val,cb){
		Notifications.before(val);
		cb();
	}
	,beforeCreate: function(val,cb){
		Notifications.before(val);
		cb();
	}
    ,calculatedPrice : function(val,callback){
        return price.cost * (1 + price.margin/100);
    }

};

