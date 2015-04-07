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
  		model 	: 'location'
  	},
  	zone : {
  		model : 'zone'
  	}
  }
  ,attrs_labels : {
    name : { es: 'Nombre' , en : 'Name' }
    ,name_es : { es: 'Nombre' , en : 'Name' }
    ,location : { es: 'Ciudad' , en : 'City' }
    ,zone : { es: 'Zona' , en : 'Zone' }
    ,voucher_text_es : { es: 'Texto del voucher, Español' , en : 'Voucher text, Spanish' }
    ,voucher_text_en : { es: 'Texto del voucher, Inglés' , en : 'Voucher text, English' }
  }
  ,labels : {
    es : 'Aeropuertos'
    ,en : 'Airports'
  }
};