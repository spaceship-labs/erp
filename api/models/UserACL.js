/**
* UserAcl.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	user : {
  		model : 'user'
  	},
  	company : {
  		model : 'company'
  	},
    permissions : {
        type : 'json'
    },
    isAdmin : {
        type : 'boolean',
        defaultsTo : false
    },
    role : {
        model : 'userRole'
    }

  },

  getPermissions : function(acl){
      if (acl.role && acl.role.permissions) {
          return acl.role.permissions;
      } else {
          return acl.permissions;
      }
  }
};

