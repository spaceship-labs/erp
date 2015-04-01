/**
* Lostandfound.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	order : { model : 'order' }
  	, user : { model : 'user' }
  }
  ,labels : {
        es : 'Objetos perdidos'
        ,en : 'Lost&Found'
    }
	,afterCreate: function(val,cb){
		Notifications.after(Lostandfound,val,'create');
		cb()
	},afterUpdate: function(val,cb){
		Notifications.after(Lostandfound,val,'update');
		cb();
	},beforeUpdate:function(val,cb){
		Notifications.before(val);
		cb();
	},beforeCreate: function(val,cb){
		Notifications.before(val);
		cb();
	}
};

