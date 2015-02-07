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
            default : 'inactive'
        },
        modes : {
            collection : 'MachineMode',
            via : 'machine'
        },
        internalReference : {
            type : 'string'
        },
        company : {
            model : 'Company'
        },
        product_types : {
            collection : 'Product_type',
            via : 'machines',
            dominant : true
        },
        name : 'string',
        machine_type : {
            type : 'string',
            enum : ['router','laminadora','corte','impresora'],
            required : true
        }
	}

};
