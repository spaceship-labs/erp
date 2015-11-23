/**
* Cupon.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    attributes:{
        name:'string',
        simple_discount:'float',
        round_discount:'float',
        max_passenger:'integer',
        round:'boolean',
        simple:'boolean',
        airport:'boolean',
        perpetuo:'boolean',
        hotel:'boolean',
        days:'integer',//if -1 infinito
        expirationDate : 'date',
        //los 3 siguientes es para no tener que agregar uno por uno los elementos disponibles
        allTours : 'boolean',
        allHotels : 'boolean',
        allTransfers : 'boolean',
        hotels : {
            collection : 'hotel',
            via : 'cupons',
        },
        tours:{
            collection:'tour',
            via:'cupons',
        },
        transfers:{
            collection:'transfer',
            via:'cupons',
        },
        company : {
            model : 'company'
        },
        user : {
            model : 'user'
        },
        cuponSingle:{
            collection:'cuponSingle',
            via:'cupon'
        }

    }
    ,labels : {
        es : 'Cupones'
        ,en : 'Cupons'
    }
    ,beforeCreate: function(val,cb){
        if(!val.simple_discount && val.round_discount)
            val.simple_discount = val.round_discount;
        
        Notifications.before(val);
        cb();
    }
};

