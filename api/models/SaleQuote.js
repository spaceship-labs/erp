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
            enum : ['normal','alta','urgente'],
            default : 'normal'
        },
        status : {
            type : 'string',
            enum : ['approved','on_hold','open','close','expired','delivered'],
            default : 'open'
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
            default : 'deliver'
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
        observation_prepress : {
            type : 'string'
        },
        observation_press : {
            type : 'string'
        },
        observation_finish : {
            type : 'string'
        },
        totalPrice : function(){
            var total = 0.0;
            if (this.products && this.products.length > 0) {
                _.forEach(this.products,function(product){
                    total += SaleProduct.getPrice(product);
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

	}

};
