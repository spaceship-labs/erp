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
            enum : ['router','impresora','laminadora','corte','impresora uv'],
            default : 'impresora'
        },
        //impresora
        ink_cost : 'float',
        ink_utility : 'float',

        calculateCost : function(){
            if (this.machine_type == 'impresora') {
                var machine_use_cost = this.ink_cost * (1 + (this.ink_utility/100));
                return machine_use_cost;
            }
        }
	}

};
