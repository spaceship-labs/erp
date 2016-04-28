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
        /*
            Tipo principal, 
            esto para no asignar vehículos de otros tipos si hay los predeterminados
        */
        transfer: { 
            model: 'transfer',
        },
        /*
            Tipos alternativos,
            tipos a elegir en caso de que no hayan vehículos disponibles del principal
        */
        transfers: {
            collection: 'transfer',
            via: 'transporttypes',
            dominant: true
        }
    }
};

