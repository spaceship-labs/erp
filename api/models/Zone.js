/**
* Location.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	name : 'string',
  	location : {
  		model : 'location'
  	},
  	locations : {
  		collection : 'location'
  		,via : 'zones'
  	}
  }
  ,label_es : 'Zonas'
	,label_en : 'Zones'
};