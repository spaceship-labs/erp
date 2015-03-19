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
        ,email : {
            type : 'string',
            unique: true,
            required: true
        }
		,password:'string'
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
		,accessList : {
            collection : 'userACL',
            via : 'user'
        }
		,companies : {
			collection: 'company',
			via: 'users',
			dominant: false
		}
        ,isAdmin : {
            type : 'boolean',
            defaultsTo : false
            /*
                Este campo no es el mismo que el del access list, 
                este es el que crea el sistema y tiene permiso para TODO
            */
        }
        ,lastLogin : 'datetime'
		,setPassword : function(val,cb){
			this.password = bcrypt.hashSync(val,bcrypt.genSaltSync(10));
			this.save(cb);
		}
		,createAccessList : function(company,permissions,isAdmin,isRep,role,cb) {
            var user = this;
            var acl = user.hasCompanyAccess(company);
            if (user.accessList && acl) {
                acl.isAdmin = isAdmin;
                acl.isRep = isRep;
                acl.permissions = permissions;
                acl.role = role;
                user.save(cb);
            } else {
                var newAcl = {
                    company : company,
                    user : user.id,
                    permissions : permissions,
                    isAdmin : isAdmin,
                    isRep : isRep,
                    role : role
                };
                UserACL.create(newAcl).exec(function(err,userACL){
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    cb();
                });
            }
        },
        hasCompanyAccess : function(company,app) {
            if (this.accessList) {
                for (var index in this.accessList){
                    var acl = this.accessList[index];
                    if (acl.company == company) {
                        return acl;
                    }
                }
            }
            return false;
        },
        hasPermission : function(company,permission) { 
            if (this.isAdmin) return true;
            if (this.accessList) {
                if (!permission) return true;
                var useAcl = this.hasCompanyAccess(company);
                if (useAcl.company){
                    for (var index in useAcl.permissions){
                        if (useAcl.permissions[index].key == permission) {
                            return useAcl.permissions[index].value;
                        }
                    }
                }
            }
            return false;
        },
        hasAppPermission : function(company,app){
            if (this.isAdmin) return true;
            if (this.accessList) {
                var useAcl = this.hasCompanyAccess(company);
                if (useAcl.company){
                    for (var appI in app.actions) {
                        var actionPermission = app.actions[appI];
                        //console.log(actionPermission);
                        for (var permissionIndex in useAcl.permissions) {
                            if (useAcl.permissions[permissionIndex].key == actionPermission.handle && useAcl.permissions[permissionIndex].value) {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        },
        isSuperAdmin : function() {
            return this.isAdmin;
        }
	}
    ,labels : {
        es : 'Usuarios'
        ,en : 'Users'
    }
    ,toJSON: function() {
        var obj = this.toObject();
        delete obj.password;
        return obj;
    }
    ,afterCreate: function(val,cb){
        Notifications.after(User,val,'create');
        cb();
    },afterUpdate: function(val,cb){
        Notifications.after(User,val,'update');
        cb();
    },beforeUpdate:function(val,cb){
        Notifications.before(val);
        cb();
    },beforeCreate: function(val,cb){
        Notifications.before(val);
        cb();
    }
};
