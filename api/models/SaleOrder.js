/**
 * SaleOrder.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

        status : { type : 'string'},

        concept : { type : 'string'},

        assignedUser : {
            model : 'User'
        },

        quote : {
            model : 'SaleQuote'
        }
	}

};
