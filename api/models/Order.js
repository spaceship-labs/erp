/**
* Order.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
/* campos default : _id, createdAt, updatedAt	*/
module.exports = {
	attributes: {
		/*folio: {
		    type: 'integer',
		    autoIncrement: true,
		    required: true,
		    unique: true
	  	},*/
		reservation_method : {
		    type: 'string'
		    ,enum: ['intern', 'api', 'rep', 'agencyApi','web'] ,
			required : true
		}
		,currency : {
        	model : 'currency'
        }
		,client : {
			model : 'client_', }
		,user : {
			model : 'user' }
		,company : {
			model : 'company' }
		,cuponsingle : {
			model : 'cuponSingle'
		}
		,cupon : {
			model : 'cupon'
		}
		,reservations : {
			collection : 'reservation', via : 'order' }
		,claims : {
			collection : 'claim', via : 'order' }
		,lostandfounds : {
			collection : 'lostandfound', via : 'order' }
		,state : {
            type:'string',
            enum : ['pending','liquidated','canceled','error']
        }
        ,payment_method : {
            type:'string',
            enum : ['creditcard','paypal','cash','prepaid','conekta']
        }
	}
	,labels : {
        es : 'Reservaciones'
        ,en : 'Reservations'
    }
	,migrate : "safe"
	,afterCreate: function(val,cb){
		Notifications.after(Order,val,'create');
		cb();
	},afterUpdate: function(val,cb){
		//Notifications.after(Order,val,'update');
		cb();
	},beforeUpdate:function(val,cb){
		//Notifications.before(val);
		cb();
	},beforeCreate: function(val,cb){
		Common.orderCustomAI(val,function(val){
			Notifications.before(val);
			cb();
		});
	}
}