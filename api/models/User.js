/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		default_company:{
			model:'companies'
		}
		,email:'string'
		,password:'string'
		,role:'integer'
		,name:'string'
		,last_name:'string'
		,icon:'string'
		,active:'integer'
		,phone:'string'
		,registration_date:'date'//createAt
		,access_date:'date'
		
		,companies:'json'//idCompany:[app1,app2]
	}
	,afterCreate: function(val,cb){
		Notifications.after(User,val,'create');
		cb()
	}
	,afterUpdate: function(val,cb){
		Notifications.after(User,val,'update');
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
