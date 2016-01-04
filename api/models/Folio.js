/**
* Folio.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	code : {
  		type : 'string'
  		,unique:true
  	}
    /*
      Los 3 siguientes ( prefix, middleNumber, sufix ) son los que conforman el código, 
      se guardan para búsquedas más rápidas.
    */
    ,prefix : 'string'
    ,middleNumber : 'integer'
    ,sufix : 'string'
  	,user : {
  		model : 'user'
  	}
  	,seller : {
  		model : 'user'
  	}
  	,expirationDate : 'date'
  	,status : {
  		type : 'string'
  		,enum : ['new','assigned','canceled','expired']
  	}
  	,order : {
  		model : 'order'
  	}
  }
};

