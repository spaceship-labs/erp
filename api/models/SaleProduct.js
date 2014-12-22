/**
 * Sale_Product.js
 *
 * @description :: Many to many quoted products
 * @docs		:: http://sailsjs.org/#!documentation/models
 *
 * realmente solo se usa como esqueleto , cuando se crea el saleQuote no se crean los saleProduct solo se agregan a una lista
 */

module.exports = {

    attributes: {

        type : {
            type : 'string',
            enum : ['product','installation']
        },

        product : {
            model: 'Product'
        },

        installation : {
            model : 'Installation'
        },

        machine : {
            model : 'Machine'
        },

        quantity: {
            type : 'integer',
            min : 1
        },

        price : {
            type : 'float',
            required : true
        },

        tax : {
            type : 'float'
        },

        price_total : {
            type : 'float'
        },

        quote : {
            model : 'SaleQuote'
        },

        name:{
            type:'string'
        },

        description : {
            type : 'string'
        },

        files : {
            type : 'array'
        }

    }


};
