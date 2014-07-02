/**
 * Client.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

		name	: { type: 'string' },

		phone	: { type: 'string' },

		company	: { type: 'string' },

		address	: { type: 'string' },

        rfc     : { type : 'string' },

        sales : {
            collection : "Sale",
            via : "client"
        }

	}

};
