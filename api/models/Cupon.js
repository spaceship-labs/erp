/**
* Cupon.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
/*
SELECT
cupons.id as mkpid,cupons.begin_airport as airport,cupons.one_way as simple,cupons.one_way_discount as simple_discount,cupons.round_trip as round,cupons.round_trip_discount as round_discount,cupons.percent_discount as gral_discount,cupons.max_pax as max_passenger,cupons.duration as days,cupons.name,cupons.begin_hotel,
users.name as user,intermediaries.name as company,
hotels.id as hotel
FROM cupons
LEFT JOIN users on cupons.user = users.id
LEFT JOIN intermediaries on users.intermediary=intermediaries.id
LEFT JOIN cupon_hotels on cupon_hotels.cupon = cupons.id
LEFT JOIN hotels on cupon_hotels.hotel = hotels.id
*/

module.exports = {
    attributes:{
        name:'string',
        gral_discount:'float',
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
        isGlobalDiscount: 'boolean',
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

