/**
 * Client_message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        client : {
            model : 'Client_'
        },
        message : 'string',
        messageType:{
            type : 'string',
            enum : ['question','inquiry'],
            defaultsTo : 'question'
        }

    }
};