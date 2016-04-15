module.exports = {

    attributes: {
        fee : 'float'
        ,feeChild : 'float'
        ,fee_round_trip : 'float'
        ,fee_round_trip : 'float'
        ,tour : {
            model : 'Tour'
        }
        ,reservations : {
            collection : 'reservation',
            via : 'prices'
        }
        ,type : {
            type : 'string',
            enum: ['none', 'extra_hour','extra_transfer'],
            defaultsTo : 'none'
        }
        ,description : {
            type : 'string'
        }
        ,active : {
            type : 'boolean',
            defaultsTo : true
        }
        //optional
        ,hour : 'integer'
        ,pax : 'integer'
    }
};