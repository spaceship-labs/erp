/**
* Order.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
/* campos default : _id, createdAt, updatedAt	*/
module.exports = {
	attributes: {
		reservation_method : {
		    type: 'string'
		    ,enum: ['intern', 'api', 'rep', 'agencyApi'] ,required : true }
		,client : {
			model : 'client_', }
		,user : {
			model : 'user' }
		,company : {
			model : 'company' }
		,reservations : {
			collection : 'reservation', via : 'order'
		}
	}
	,migrate : "safe"
	,afterCreate: function(val,cb){
		Notifications.after(Order,val,'create');
		cb();
	},afterUpdate: function(val,cb){
		Notifications.after(Order,val,'update');
		cb();
	},beforeUpdate:function(val,cb){
		Notifications.before(val);
		cb();
	},beforeCreate: function(val,cb){
		Notifications.before(val);
		cb();
	}
}