/**
* Company.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		name:'string'
		,icon:'string'
		,description:'string'
		,address:'string'
		,zipcode:'string'
		,app:'array'
		,base_currency:{
			model : 'currency'
		}
		,currency_comission:'float'
		,currencies:{
			collection : 'currency',
			via : 'companies',
			dominant : true
		}
		,active: 'boolean'
		,users : {
			collection: 'user',
			via: 'companies',
			dominant: true
		}
		,apps : 'json'

	}
	,afterCreate: function(val,cb){
		Notifications.after(Company,val,'create');
		cb()
	}
	,afterUpdate: function(val,cb){
		Notifications.after(Company,val,'update');
		cb();
	}
	,beforeUpdate:function(val,cb){
		Notifications.before(val);
		cb();
	}
	, beforeCreate: function(val,cb){
		Notifications.before(val);
		cb();
	}
};

