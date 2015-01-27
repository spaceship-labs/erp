/**
* Price.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
  	name : 'string',
  	zone1 : {
  		model 	: 'zone'
  	},
    zone2 : {
      model   : 'zone'
    },
  	company : {
  		model 	: 'company'
  	},
  	transfer : {
  		model 	: 'transfer'
  	},
  	airport : {
  		model 	: 'airport'
  	},
    location : {
      model   : 'location'
    }
  }
};