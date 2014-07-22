/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		default_company:{
			model:'company'
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
		
		,companies : {
			collection: 'company',
			via: 'users',
			dominant: false
		}
		,apps : {
			collection : 'user_app',
			via : 'user',
		}
		,setPassword : function(val,cb){
			var bcrypt = require('bcrypt');
			this.password = bcrypt.hashSync(val,bcrypt.genSaltSync(10));
			this.save(cb);
		}
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
	,beforeCreate: function(val,cb){
		Notifications.before(val);
		cb();
	}

};
