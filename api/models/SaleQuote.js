    /**
 * Client.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

        priority : {
            type : 'string',
            enum : ['normal','fast','urgent'],
            defaultsTo : 'normal'
        },
        status : {
            type : 'string',
            enum : ['on_hold','open','close','expired','delivered'],
            defaultsTo : 'open'
        },

        files : {
            type: 'array'
        },

        user : {
            model : 'User',
            required : true
        },

        sale : {
            model : 'Sale'
        },

        invoice : {
            model : 'SaleInvoice'
        },

        order : {
            model : 'SaleOrder'
        },

        estimated_date : {
            type : 'date'
        },

        products : {
            collection : "SaleProduct",
            via : "quote"
        },
        client : {
            model : 'Client_',
            required : true
        },
        company : {
            model : 'Company',
            required : true
        },
        name : {
            type : 'string'
        },
        delivery_date : {
            type : 'date'
        },
        delivery_mode : {
            type : 'string',
            enum : ['pickup','deliver'],
            defaultsTo : 'deliver'
        },
        deliver_to : {
            model : 'Client_'
        },
        deliver_to_contact : {
            model : 'Client_contact'
        },
        bill_to : {
            model : 'Client_'
        },
        bill_to_contact : {
            model : 'Client_contact'
        },
        is_approved : {
            type : 'boolean',
            defaultsTo : false
        },
        approved_reason : {
            type : 'string',
            enum : ['none','firm','odc','email'],
            defaultsTo : 'none'
        },
        approved_date : {
            type : 'date'
        },
        approved_by : {
            model : 'User'
        },
        payment_conditions : {
            type : 'string'
        },
        validity_date : {
            type : "date"
        },
        validity_string : {
            type : 'string'
        },
        delivery_time : {
            type : 'string'
        },
        directed_to_contact : {
            model : 'Client_contact'
        },
        totalPrice : function(){
            var total = 0.0;
            if (this.products && this.products.length > 0) {
                _.forEach(this.products,function(product){
                    total += SaleProduct.getPrice(product,false);
                });
            }
            return total;
        },
        productsString : function(){
            var result = "";
            if (this.products && this.products.length > 0) {
                _.forEach(this.products,function(product){
                    result += product.name;
                });
            } else {
                result = "No products added";
            }
            return result;
        }
	},

    totalPriceString : function(quote){
        var _s = require("underscore.string");
        var total = quote.totalPrice();
        return _s.numberFormat(total,2);
    }

};
