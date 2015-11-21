/**
* TransportType.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {
        name: {
            type: 'string',
            required: true
        },
        pax: {
            type: 'integer',
            required: true
        },
        transports: {
            collection: 'transport',
            via: 'types',
            dominant: true
        },
        transfers: {
            collection: 'transfer',
            via: 'transporttypes',
            dominant: true
        }
    }
};

