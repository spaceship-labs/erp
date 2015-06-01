/**
* Company_product.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
module.exports = {
  attributes: {
  	agency : {
  		model : 'company' }
  	,product_type : {
  		type : 'string'
  		, enum : ['hotel','tour','transfer'] }
  	,room : {
  		model : 'room' }
  	,tour : {
  		model : 'tour' }
  	,transfer : {
  		model : 'transfer' }
  	,transferprice : {
  		model : 'transferprice' }
  	/* Para los precios por temporada? */
  	,season : {
  		model : 'season' }
  	,commission_agency : 'integer'
  	,fee : 'float'
  	,feeChild : 'float'
  }
};