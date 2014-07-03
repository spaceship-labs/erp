/**
 * Sale.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

		client	: { type: 'int' },

		status	: { type: 'string' },

		total_amount	: { type: 'float' },

		create_datetime	: { type: 'datetime' },

        client : {
            model : "Sale_Client"
        },

        quotes : {
            collection : "Sale_Quote",
            via : "sale"
        },

        invoices : {
            collection : "Sale_Invoice",
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
