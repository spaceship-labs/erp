/**
 * Sale.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

		status	: {
            type: 'string',
            enum : ['status1','cancelled','status2'],
            default : 'status1'
        },

        company : { type : "string", required : true },

        user : {
            model : "User",
            required : true
        },

        client : {
            model : "Client_",
            required : true
        },

        quotes : {
            collection : "SaleQuote",
            via : "sale"
        },

        invoices : {
            collection : "SaleInvoice",
            via : "sale"
        },

        workOrders : {
            collection : "SaleWorkOrder",
            via : "sale"
        }

	}

};
