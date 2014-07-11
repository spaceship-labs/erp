/**
 * Sale.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

		status	: {
            type: 'string',
            enum : ['status1','cancelled','status2'],
            default : 'status2'
        },

		total_amount	: { type: 'float' },

        company : { type : "string", required : true },

        user : { type : "string", required : true },

        client : {
            model : "SaleClient"
        },

        quotes : {
            collection : "SaleQuote",
            via : "sale"
        },

        invoices : {
            collection : "SaleInvoice",
            via : "sale"
        }

	}
    ,afterCreate: function(val,cb){
        Notifications.after(Sale,val,'create');
        cb()
    }
    ,afterUpdate: function(val,cb){
        Notifications.after(Sale,val,'update');
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
