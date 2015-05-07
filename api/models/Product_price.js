/**
 * Product_price.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        price_list : {
            type : 'integer',
            default : 1
        },
        product : {
            model : 'Product'
        },
        cost : {
            type : 'float'
        },
        margin : {
            type : 'float'
        },
        minQuantityRestriction : {
            type : 'integer'
        },
        maxQuantityRestriction : {
            type : 'integer'
        },
        minDateRestriction : {
            type : 'date'
        },

        maxDateRestriction : {
            type : 'date'
        },
        internalReference : {
            type : 'string'
        },
        getPrice : function() {
            return this.cost + (1 + (this.margin/100));
        }
    }

};
