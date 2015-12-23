
module.exports = {

    attributes: {
        fee : 'float'
        ,feeKid : 'float'
        ,extra_type : {
            type : 'string',
            enum: ['none', 'extra_hour'],
            defaultsTo : 'none'
        }
        ,extra_selector : {
            type : 'integer'
        }
        ,tour : {
            model : 'Tour'
        }
    }
};