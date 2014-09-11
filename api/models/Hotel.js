/**
* Hotel.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		name : 'string',
		phones : 'array',
		location : {
			model : 'location',
		},
		rooms : {
			collection : 'room',
			via: 'hotel',
		},
		seasons : {
			collection : 'season',
			via: 'hotel',
		},
	}
  	,afterCreate: function(val,cb){
		Notifications.after(Hotel,val,'create');
		cb()
	}
	,afterUpdate: function(val,cb){
		Notifications.after(Hotel,val,'update');
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

