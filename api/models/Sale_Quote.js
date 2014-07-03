/**
 * Client.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

        create_datetime : { type:'datetime' },

        total_amount : { type : 'float' },

        status : { type : 'string'},

        file    : { type: 'string' },

        user : {
            model : 'User'
        },

        sale : {
            model : "Sale"
        }

	}
    ,afterCreate: function(val,cb){
        Notifications.after(Sale_Quote,val,'create');
        cb()
    }
    ,afterUpdate: function(val,cb){
        Notifications.after(Sale_Quote,val,'update');
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
