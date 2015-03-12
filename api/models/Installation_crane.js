/**
 * Created by Owner on 9/17/2014.
 */
module.exports = {

    attributes: {
        company : { model : 'Company' },
        installations : {
            collection : 'Installation',
            via : 'crane'
        },
        name : {
            type : 'string',
            required : true
        },
        price_zone : {
            type : 'json'
        }
    }

};