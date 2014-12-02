    /**
 * Client.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

        status : {
            type : 'string',
            enum : ['approved','on_hold','open','close','expired','delivered'],
            default : 'on_hold'
        },

        fileName : {
            type: 'string'
        },

        user : {
            model : 'User',
            required : true
        },

        sale : {
            model : 'Sale'
        },

        products : {
            collection : "SaleProduct",
            via : "saleQuote"
        },
        client : {
            model : 'Client_',
            required : true
        },
        company : {
            model : 'Company',
            required : true
        },
        totalPrice : function(){
            var total = 0.0;
            if (this.products && this.products.length > 0) {
                for (var i in this.products) {
                    if (_.isNumber(this.products[i].priceTotal))
                        total += this.products[i].priceTotal;

                }
            }
            return total;
        },
        productsString : function(){
            var result = "";
            if (this.products && this.products.length > 0) {
                for (var i in this.products) {
                    //console.log(this.products[i]);
                    if (i > 0)
                        result += " , ";
                    result += this.products[i].name;
                }
            } else {
                result = "--";
            }
            return result;
        }

	}

};
