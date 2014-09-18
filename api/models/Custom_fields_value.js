/**
 * Custom_fields_value.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        field : {
            model : 'Custom_fields'
        },
        product : {
            model : 'Product'
        },
        value : 'string'
    }
};