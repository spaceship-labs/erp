/**
 * Product_discount.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        product : {
            model : 'Product'
        },
        discount : {
            type : 'float'
        },
        discount_type : {
            type : 'string',
            enum : ['amount_discount','percentage_discount']
        },
        client : {
            model : 'Client_'
        }

    }

};
