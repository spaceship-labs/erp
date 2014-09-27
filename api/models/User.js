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
		,icon:'json'
		,active: 'boolean'
		,phone:{
			type:'string'
			,defaultsTo:''
		}
		,registration_date:'date'//createAt
		,access_date:'date'
		,accessList : 'json'
		
		,companies : {
			collection: 'company',
			via: 'users',
			dominant: false
		}
		,setPassword : function(val,cb){
			var bcrypt = require('bcrypt');
			this.password = bcrypt.hashSync(val,bcrypt.genSaltSync(10));
			this.save(cb);
		}
		,createAccessList : function(apps,company,cb){
			require('async');
			var ac = {};
			var user = this;
			async.map(
				apps,
				function(app,callback){
					var app_config = sails.config.apps[app];
					var views = {};
					for(var key in app_config.views){
						views[key] = {
							label : app_config.views[key].label,
							route : key,
							permissions : {
								create : true,
								update : true,
								delete : true
							}
						}
					}
					var app_ac = {
						permission : true,
						label : app_config.label,
						views : views,
					};
					ac[app] = app_ac;
					callback(null,app_ac);
				},
				function(e,r){
					user.accessList = ac;
					user.save(cb);
				}
			);
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
