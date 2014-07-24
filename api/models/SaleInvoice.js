/**
 * Client.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

		name	: { type: 'string' },

        description : { type : 'string'},

        amount  : { type:'float' },

        file    : { type: 'string' },

        create_datetime : { type : 'datetime' },

        user : {
            model : 'User'
        },

        sale : {
            model : "Sale"
        }


	}

};
