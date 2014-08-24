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
    gallery:'array',
    fields : 'array',
    marca:'string',
    subtype : 'string',
    internalReference : 'string'
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

};

