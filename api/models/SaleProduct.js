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

        machines : {
            collection : 'Machine'
        },

        quantity: {
            type : 'integer',
            min : 1
        },

        price : {
            type : 'float',
            required : true
        },

        original_price : {
            type : 'float'
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
        },

        size : {
            type : 'json'
        },

        visible_size : {
            type : 'json'
        },

        user : {
            model : 'user'
        },

        extras : {
            collection : 'SaleProductExtra',
            via : 'product'
        }
    },

    getPrice : function(product,single) {
        var total = 0;
        var size = product.size ? (product.size.width * product.size.height) : 0;
        if (product.original_price && product.quantity && size) {
            if (product.machines) {
                total += _.reduce(product.machines,function(sum,machine){
                    return sum + (size * machine.mode.price);
                },0);
            }

            total += size * product.original_price;

            if (!single)
                total *=  product.quantity;

            if (product.extras && product.extras.length > 0) {
                total += _.reduce(product.extras, function (sum, extra) {
                    return sum + SaleProductExtra.getPrice(extra);
                }, 0);
            }
            return total;
        } else {
            return 0;
        }
    },

    getUnitPriceString : function(product) {
        var total = this.getPrice(product,true);
        var _s = require("underscore.string");
        return _s.numberFormat(total,2);
    },

    getPriceString : function(product) {
        var total = this.getPrice(product,false);
        var _s = require("underscore.string");
        return _s.numberFormat(total,2);
    },

    beforeCreate : function(values,cb) {
        values.price_total = this.getPrice(values,false);
        cb();
    }
};
