/**
* PackageTour.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		name : 'string',
		company : {
			model : 'company'
		},
		user : {
			model : 'user'
		},
		items : {
			collection : 'packageitem',
			via : 'package_'
		}
	}
	,labels : {
        es : 'Paquetes'
        ,en : 'Packages'
    }
  	,afterCreate: function(val,cb){
		Notifications.after(PackageTour,val,'create');
		cb()
	}
	,afterUpdate: function(val,cb){
		Notifications.after(PackageTour,val,'update');
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

