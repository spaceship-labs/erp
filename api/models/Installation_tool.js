/**
 * Created by Owner on 9/17/2014.
 */
module.exports = {

    attributes: {
        company : 'string',
        installations : {
            collection : 'Installation',
            via : 'tools'
        },
        product : {
            model : 'Product'
        }
    }

};