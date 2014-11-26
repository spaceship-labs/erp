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
        type : 'array'
    },
    permissions2 : {
        type : 'json'
    },
    isAdmin : {
        type : 'boolean',
        defaultsTo : false
    }
  }
};

