/**
* TransportAsign.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    transport: {
        model: 'transport',
        //required: true
    },
    start: {
        type: 'datetime',
        required: true
    },
    end: {
        type: 'datetime',
        required: true
    }

  }
};

