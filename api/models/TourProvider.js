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
    ,base_currency:{
      model : 'currency'
    }
    ,exchange_rate : 'integer'
  	,tours : {
  		collection : 'tour'
  		, via : 'provider'
  	}
    ,fee : 'float' /*Precio público*/
    ,feeChild : 'float' /*Precio público*/
    ,fee_base : 'float' /*Precio contable*/
    ,feeChild_base : 'float' /*Precio contable*/
    ,commission_agency : 'integer'
    ,commission_sales : 'integer'
    ,mxnPrices : 'boolean'
    ,departurePoints : 'json'
  }
  ,labels : {
    es : 'Proveedores de Tours'
    ,en : 'Tours Providers'
  }
};

