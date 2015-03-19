/**
* Location.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
  	name :'string',
  	zones : {
  		collection 	: 'zone',
  		via 		: 'location'
  	},
  	locations : {
  		collection : 'location',
  		via : 'id',
      dominant : true
  	}
  }
  ,labels : {
      es : 'Ciudades'
      ,en : 'Cities'
  }
};