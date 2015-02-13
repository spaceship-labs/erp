/**
 * SaleProductExtra.js
 *
 * @description :: Many to many quoted products
 * @docs		:: http://sailsjs.org/#!documentation/models
 *
 */

module.exports = {

    attributes: {

        name : {
            type : 'string'
        },

        price : {
            type : "float"
        },

        quantity : {
            type : 'integer'
        },

        product : {
            model : 'SaleProduct'
        }

    },

    getPrice : function(extra){
        return extra.price * extra.quantity;
    }


};
