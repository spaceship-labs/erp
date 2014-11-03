    /**
 * Client.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

        status : {
            type : 'string',
            enum : ['approved','on_hold','open','close','expired','delivered'],
            default : 'on_hold'
        },

        fileName : {
            type: 'string'
        },

        user : {
            model : 'User',
            required : true
        },

        sale : {
            model : 'Sale'
        },

        products : {
            collection : "SaleProduct",
            via : "saleQuote"
        },
        client : {
            model : 'Client_',
            required : true
        },
        company : {
            model : 'Company',
            required : true
        }

	}

};
