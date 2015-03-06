/**
 * SaleOrder.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

        status : {
            type : 'string',
            enum : ['open','close'],
            defaultsTo : 'open'
        },

        concept : { type : 'string'},

        assignedUser : {
            model : 'User'
        },

        quote : {
            model : 'SaleQuote'
        },

        observation_prepress : {
            type : 'string'
        },
        observation_press : {
            type : 'string'
        },
        observation_finish : {
            type : 'string'
        },
        estimated_date : {
            type : "date"
        }
	}

};
