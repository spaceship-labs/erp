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
  		via 		: 'locations'
  	},
  	locations : {
  		collection : 'location',
  		via : 'id',
        dominant : true
  	},
    airports : {
      collection : 'airport'
      ,via : 'location'
    },
    hotels : {
      collection : 'hotel'
      ,via : 'location'
    }
  }
  , attrs_labels : {
    name : { es : 'Nombre' , en : 'Name' }
    ,url_title : { es : 'Título url' , en : 'Url title' }
    ,zipcode : { es : 'Código postal' , en : 'Zip code' }
    ,country : { es : 'País' , en : 'Country' }
    ,locations : { es : 'Ciudades relacionadas' , en : 'Related Cities' }
    ,zones : { es : 'Zonas' , en : 'Zones' }
    ,description_es : { es : 'Descripción español' , en : 'Spanish description' }
    ,description_en : { es : 'Descripción inglés' , en : 'English description' }
  }
  ,labels : {
      es : 'Ciudades'
      ,en : 'Cities'
  }
};