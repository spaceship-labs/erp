/**
 * Client.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

		name	: { type: 'string' },

		phone	: { type: 'string' },

		company	: { type: 'string' },

		address	: { type: 'string' },

        rfc     : { type : 'string' },

        sales : {
            collection : "Sale",
            via : "client"
        }

	}
    ,afterCreate: function(val,cb){
        Notifications.after(Sale_Client,val,'create');
        cb()
    }
    ,afterUpdate: function(val,cb){
        Notifications.after(Sale_Client,val,'update');
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
