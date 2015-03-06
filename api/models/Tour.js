/**
* Tour.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	attributes: {
		location : {
			model : 'location',
		},
		days : 'array',
	}
  	,afterCreate: function(val,cb){
		Notifications.after(Tour,val,'create');
		cb()
	}
	,afterUpdate: function(val,cb){
		Notifications.after(Tour,val,'update');
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