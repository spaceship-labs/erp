/**
 * Client.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

        total_amount : { type : 'float' },

        status : { type : 'string',enum : ['approved','status1','status2'] },

        fileName : { type: 'string' },//se genera el pdf ?

        user : { type : 'string' },

        sale : {
            model : "Sale"
        },

        products : {
            collection : "Product",
            via : "quoteProducts",
            through: 'salequoteproducts'
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
