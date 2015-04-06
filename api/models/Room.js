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
		views : {
			collection : 'hotelRoomView',
			via : 'rooms'
		},
		fees : 'json',

	}
  	,migrate : "safe"
	,labels : {
        es : 'Cuartos'
        ,en : 'Rooms'
    }
  	,afterCreate: function(val,cb){
		Notifications.after(Room,val,'create');
		cb()
	}
	,afterUpdate: function(val,cb){
		console.log('afterUpdate: room');
		Notifications.after(Room,val,'update');
		cb();
	}
	,beforeUpdate:function(val,cb){
		console.log('beforeUpdate: room');
		Notifications.before(val);
		cb();
	}
	,beforeCreate: function(val,cb){
		Notifications.before(val);
		cb();
	}
};

