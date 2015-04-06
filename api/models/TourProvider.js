/**
* TourProvider.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	name: 'string'
  	,address : 'string'
  	,country : 'string'
  	,location : {
  		model : 'location'
  	}
  	,tours : {
  		collection : 'tour'
  		, via : 'provider'
  	}
  }
  ,labels : {
        es : 'Proveedores de Tours'
        ,en : 'Tours Providers'
    }
};

