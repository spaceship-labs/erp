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
            default : 'status1'
        },

        company : { model : 'Company' },

        user : {
            model : "User",
            required : true
        },

        client : {
            model : "Client_",
            required : true
        },

        quotes : {
            collection : "SaleQuote",
            via : "sale"
        },

        invoices : {
            collection : "SaleInvoice",
            via : "sale"
        },

        workOrders : {
            collection : "SaleWorkOrder",
            via : "sale"
        }

	}
    ,afterCreate: function(val,cb){
        Notifications.after(Sale,val,'create');
        cb();
    }
    ,afterUpdate: function(val,cb){
        Notifications.after(Sale,val,'update');
        cb();
    }
    ,beforeUpdate:function(val,cb){
        Notifications.before(val);
        cb();
    }
    ,beforeCreate: function(val,cb){
        Notifications.before(val);
        cb();
    }

};
