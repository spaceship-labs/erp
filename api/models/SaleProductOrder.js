/**
 * SaleOrder.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

        status : { type : 'string'},

        assignedUser : {
            model : 'User'
        },

        product : {
            model : 'SaleProduct'
        },

        order : {
            model : 'SaleOrder'
        },

        tasks : {
            collection : 'SaleProductOrderTask',
            via : 'productOrder'
        },

        authorizationTask : {
            model : 'SaleProductOrderTask'
        },

        prepressTask : {
            model : 'SaleProductOrderTask'
        }


	}

};
