/**
* TransportAsign.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    arrivalpickup_time : 'datetime'
    ,departurepickup_time : 'datetime'
    ,vehicle_arrival : { //vehículo asignado para una llegada
        model : 'transport'
    }
    ,vehicle_departure : { //vehículo asignado para una salida
        model : 'transport'
    }
    ,company : { //transportista
        model : 'company'
    }
    ,no_show : 'boolean' //no se presentó el cliente?
    ,notes : 'string' 
    ,driver : 'string' //no hay base de datos por eso string
    /*transport: {
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
    },

    zoneFrom: {
        model: 'zone'
    },

    zoneTo:{
        model: 'zone'
    },
    
    price: {
        model: 'transferprice'
    },
    transport : {
        model : 'transfer'
    }*/
  }
};

