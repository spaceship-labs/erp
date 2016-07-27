/**
* DeparturePoint.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	name : 'string'
  	,description : 'string'
    ,lat : 'float'
    ,lng : 'float'
  	,type : {
  		type : 'string'
  		,enum : ['zone', 'hotel']
  	}
    ,location : {
      model : 'location'
    }
  	,hotel : {
  		model : 'hotel'
  	}
  	,zone : {
  		model : 'zone'
  	}
  	,tours : {
  		collection : 'tour'
  		,via : 'departurepoints'
  	}
  }
};

