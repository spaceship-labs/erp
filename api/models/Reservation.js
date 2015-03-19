/**
* Reservation.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
/* campos default : _id, createdAt, updatedAt	
fee : 'float'
		,state : { type:'string', enum : ['pending','liquidated','canceled'] }
		,payment_method : { type:'string', enum : ['creditcard','paypal','cash'] }
		,origin : { type:'string', enum : ['hotel','airport'] }
		,type : { type:'string', enum : ['round_trip','one_way'] }
		,reservation_type : { type:'string', enum : ['tour','hotel','transfer'] }
		,pax : 'integer'
		,arrival_date : 'date'
*/
module.exports = {
	attributes: {
		user : {
			model : 'user' }
		,company : {
			model : 'company' }
		,order : {
			model : 'order', }
		,client : {
			model : 'client_' }
		,airport : {
			model : 'airport' }
		,tour : {
			model : 'tour' }
		,hotel : {
			model : 'hotel' }
		,transfer : {
			model : 'transfer' }
	}
	,migrate : "safe"
	,labels : {
        es : 'Reservaciones'
        ,en : 'Reservations'
    }
	,afterCreate: function(val,cb){
		//Notifications.after(Reservation,val,'create');
		cb();
	},afterUpdate: function(val,cb){
		//console.log('afterUpdate');
		//Notifications.after(Reservation,val,'update');
		cb();
	},beforeUpdate:function(val,cb){
		//console.log('beforeUpdate');
		//Notifications.before(val);
		cb();
	},beforeCreate: function(val,cb){
		//Notifications.before(val);cb();
		cb();
	}
}