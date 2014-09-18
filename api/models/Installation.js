/**
 * Created by Owner on 9/17/2014.
 */

module.exports = {

    attributes: {
        work_type : {
            model : 'Installation_work_type'
        },
        user : {
            model : 'User'
        },
        zones : {
            model : 'Installation_zone'
        },
        quote : {
            model : 'SaleQuote'
        },
        staff : 'integer',
        hours : {
            collection : 'Installation_hours'
        },
        tools : {
            collection : 'Product'
        },
        material : {
            collection : 'Product'
        },
        extras : {
            collection : 'Installation_extra_service',
            via : 'installation'
        },
        cranes : {
            collection : 'Installation_cranes',
            via : 'installation'
        },
        description : 'string',
        indications : 'string'
    }

};