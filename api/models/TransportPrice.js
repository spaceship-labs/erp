/**
* TransportPrice.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    zoneFrom: {
        model: 'zone'
    },
    zoneTo: {
        model: 'zone'
    },
    service_type: 'string',
    price: 'float'

  }
};

