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
        email : 'string',

		company	: { model : 'Company'  },
		address	: { type: 'string' },

        rfc     : { type : 'string' },

        user : { model : 'User'  },

        source : {
            type : 'string',
            enum : ['internal','external'],
            defaultsTo : 'internal'
        },
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
        messages : {
            collection : 'Client_message',
            via : 'client'
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
    , attrs_labels : {
        name : { es : 'Nombre' , en : 'Name' }
        ,address : { es : 'Dirección' , en : 'Address' }
        ,rfc : { es : 'RFC' , en : 'RFC' }
        ,phone : { es : 'Teléfono' , en : 'Phone' }
        ,city : { es : 'Ciudad' , en : 'City' }
        ,state : { es : 'Estado' , en : 'State' }
        ,country : { es : 'País' , en : 'Country' }
        ,comments : { es : 'Comentarios' , en : 'Comments' }
    }
    ,labels : {
        es : 'Clientes'
        ,en : 'Clients'
    }

};
