/**
 * Sale.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

		client	: { type: 'int' },

		status	: { type: 'string' },

		total_amount	: { type: 'decimal' },

		dtCreated	: { type: 'date' },

        client : {
            model : "Sale_Client"
        },

        quotes : {
            collection : "Sale_Quote",
            via : "sale"
        },

        invoices : {
            collection : "Sale_Invoice",
            via : "sale"
        }

	}

};
