/**
* Room.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {	
		hotel : {
			model : 'hotel',
		},
		view : {
			model : 'hotelRoomView',
		},
		fees : 'json',

	}
  	,migrate : "safe"
  	
  	,afterCreate: function(val,cb){
		Notifications.after(Room,val,'create');
		cb()
	}
	,afterUpdate: function(val,cb){
		Notifications.after(Room,val,'update');
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

