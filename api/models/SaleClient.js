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

		company	: { type: 'string' , required : true },

		address	: { type: 'string' },

        rfc     : { type : 'string' , required : true },

        user : { type : 'string' , required : true },

        sales : {
            collection : "Sale",
            via : "client"
        }

	}

};
