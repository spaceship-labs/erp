/**
* Companies.js
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
		,active:'integer'
		,app:'array'
		,base_currency:'string'
		,currency_comission:'float'
		,currencies:'array'

	}
	,afterCreate: function(val,cb){
		Notifications.after(Companies,val,'create');
		cb()
	}
	,afterUpdate: function(val,cb){
		Notifications.after(Companies,val,'update');
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

