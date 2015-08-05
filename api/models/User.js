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
        ,password : {
            type : 'string'
        }
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
            defaultsTo : false,
            required : true
        }
        ,lastLogin : 'datetime'
		,setPassword : function(val,cb){
			this.password = bcrypt.hashSync(val,bcrypt.genSaltSync(10));
			this.save(cb);
		}
        ,generateAllPermissions : function(){
            var apps = sails.config.apps;
            var permissions = [];
            //console.log(apps);
            for(var x in apps){
                for(var y in apps[x].actions) {
                    if(apps[x].actions[y].handle){
                        console.log(apps[x].actions[y].handle);
                        permissions.push({key:apps[x].actions[y].handle,value:true});
                        permissions.push({key:apps[x].actions[y].handle+'_c',value:true});
                        permissions.push({key:apps[x].actions[y].handle+'_e',value:true});
                        permissions.push({key:apps[x].actions[y].handle+'_d',value:true});
                    }
                };
            }
            //console.log(permissions);
            return permissions;
        }
		,createAccessList : function(company,permissions,isAdmin,isRep,role,cb) {
            var user = this;
            var acl = user.hasCompanyAccess(company);
            if (user.accessList && acl) {
                acl.isAdmin = isAdmin;
                acl.isRep = isRep;
                if(acl.isAdmin){
                    acl.permissions = user.generateAllPermissions();
                }else{
                    acl.permissions = permissions;
                }
                acl.role = role;
                acl.company = company;
                user.save(cb);
            } else {
                if(isAdmin){
                    permissions = user.generateAllPermissions();
                }
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
    ,attrs_labels : {
        name : { es : 'Nombre' , en : 'Name' }
        ,last_name : { es : 'Apellido' , en : 'Lastname' }
        ,email : { es : 'Email' , en : 'Email' }
        ,active : { es : 'Activo' , en : 'Active' }
        ,default_company : { es : 'Empresa principal' , en : 'Default company' }
        ,isAdmin : { es : 'Es administrador' , en : 'Is admin' }
        ,phone : { es : 'Teléfono' , en : 'Phone' }
        ,password : { es : 'Contraseña' , en : 'Password' }
        ,icon : { es : 'Foto de perfil' , en : 'Profile picture' }
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
