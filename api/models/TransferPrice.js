/**
* Price.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
  	name : 'string',
  	zone1 : { model 	: 'zone' },
    zone2 : { model   : 'zone' },
  	company : { model 	: 'company' },
  	transfer : { model 	: 'transfer' },
  	airport : { model 	: 'airport' },
    location : { model   : 'location' },
    location2 : { model   : 'location' }
    ,one_way : 'float'
    ,round_trip : 'float'
    ,one_way_child : 'float'
    ,round_trip_child : 'float'
    ,commission_agency : 'float'
    ,distance : 'float'
    ,gasoline : 'string'
    ,time : 'datetime'
    ,active : 'boolean'
    ,type : {
      type : 'string'
      ,enum : ['agency','provider']
      ,defaultsTo : 'agency'
    }
  }
};
