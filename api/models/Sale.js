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

        sale_client : {
            model : "Sale_Client"
        }

	}

};
