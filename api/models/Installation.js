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
        zone : {
            model : 'Installation_zone'
        },
        quote : {
            model : 'SaleQuote'
        },
        staff : 'integer',
        hours : {
            collection : 'Installation_hour',
            via : 'installations'
        },
        tools : {
            collection : 'Installation_tool',
            via : 'installations'
        },
        materials : {
            collection : 'Installation_material',
            via : 'installations'
        },
        extras : {
            collection : 'Installation_extra_service',
            via : 'installation'
        },
        crane : {
            model : 'Installation_crane'
        },
        description : 'string',
        indications : 'string',
        company : { model : 'Company' },
        date : 'date'
    }

};