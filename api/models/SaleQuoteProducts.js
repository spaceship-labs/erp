/**
 * Sale_Quote_Product.js
 *
 * @description :: Many to many quoted products
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

        products: {
            model: 'Product',
            via: 'saleQuotes'

        },

        saleQuotes: {
            model : 'SaleQuote',
            via : 'product'
        }

    }


};
