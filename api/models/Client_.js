/**
 * Client.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

		name	: { type: 'string',required : true },

		phone	: { type: 'string' },

		company	: { model : 'Company'  },

		address	: { type: 'string' },

        rfc     : { type : 'string' , required : true },

        user : { model : 'User' , required : true },

        comments : { type : 'string' },

        sales : {
            collection : "Sale",
            via : "client"
        },

        quotes : {
            collection : "SaleQuote",
            via : "client"
        },

        contacts : {
            collection : "Client_contact",
            via : "client"
        },

        product_discounts : {
            collection : "Product_discount",
            via : "client"
        },

        discount : {
            type : 'float'
        },

        city : {
            type : 'string'
        },

        state : {
            type : 'string'
        },

        country : {
            type : 'string'
        }

	}
    ,labels : {
        es : 'Clientes'
        ,en : 'Clients'
    }

};
