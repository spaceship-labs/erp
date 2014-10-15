/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcrypt');
var async = require('async');

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
        ,isAdmin : 'boolean'
        ,permissions : 'array'
        ,lastLogin : 'datetime'
		,setPassword : function(val,cb){
			this.password = bcrypt.hashSync(val,bcrypt.genSaltSync(10));
			this.save(cb);
		}
		,createAccessList : function(apps,cb){
			var permissions = [];
			var user = this;
			async.map(
				apps,
				function(app,callback){
					var app_config = sails.config.apps[app];
					for(var key in app_config.permissions){
						permissions.push(key.handle);
					}
					callback();
				},
				function(){
					user.accessList = permissions;
					user.save(cb);
				}
			);
		},
        hasPermission : function(permission) {
            if (this.isAdmin) return true;
            if (this.permissions) {
                this.permissions.forEach(function(p){
                    if (p == permission) {
                        return true;
                    }
                });
            }
            return false;
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
