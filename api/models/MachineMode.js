/**
 * Machine.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
        name : {
            type : 'string',
            required : true
        },
        velocity : {
            type : 'float'
        },
        price : {
            type : 'float' //precio por metro 2
        },
        machine : {
            model : 'Machine'
        }
	}

};
