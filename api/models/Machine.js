/**
 * Machine.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
        status : {
            type : 'string',
            enum : ['active','inactive'],
            default : 'active'
        },
        modes : {
            collection : 'MachineMode',
            via : 'machine',
            dominant : true
        },
        internalReference : {
            type : 'string'
        },
        company : {
            type : 'string',
            required : true
        }


	}

};
