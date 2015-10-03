/**
* Transfer.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
module.exports = {
  attributes: {
    name: { 
      type: 'string',
      required : true },
		cupons:{
			model : 'cupon',
			via : 'transfers' }
    ,priceByHr : 'float'
    ,max_pax : 'integer'
    ,url_title : 'string'
    ,description_es : 'string'
    ,description_en : 'string'
    ,description_pt : 'string'
    ,description_ru : 'string'
    ,agencies : {
      collection : 'companyproduct'
      , via : 'transfer'
    }
    ,transferprices : {
      model : 'transferprice'
      ,via : 'transfer'
    }
    ,service_type :{
      type : 'string'
      ,enum : ['C','P','D'] //c=colectivo , p=privado , d=directo
    }
  }
  ,labels : { es : 'Traslados', en : 'Transfers' }
};