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
            enum : ['approved','active','inactive'],
            default : 'active'
        },

        fileName : {
            type: 'string'
        },

        user : {
            model : 'User'
        },

        sale : {
            model : "Sale"
        },

        products : {
            collection : "SaleProduct",
            via : "saleQuote",
            required : true
        }

	}
    ,afterCreate: function(val,cb){
        Notifications.after(SaleQuote,val,'create');
        cb()
    }
    ,afterUpdate: function(val,cb){
        Notifications.after(SaleQuote,val,'update');
        cb();
    }
    ,beforeUpdate:function(val,cb){
        Notifications.before(val);
        cb();
    }
    , beforeCreate: function(val,cb){
        Notifications.before(val);
        cb();
    }

};
