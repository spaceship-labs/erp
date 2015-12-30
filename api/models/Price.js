
module.exports = {

    attributes: {
        fee : 'float'
        ,feeChild : 'float'

        ,tour : {
            model : 'Tour'
        }
        ,reservations : {
            collection : 'reservation',
            via : 'prices'
        }
        ,type : {
            type : 'string',
            enum: ['none', 'extra_hour'],
            defaultsTo : 'none'
        }
        ,description : {
            type : 'string'
        }

        //optional
        //type == 'extra_hour'
        ,hour : 'integer'
    }
};