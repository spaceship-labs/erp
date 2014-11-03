module.exports = {

    attributes: {

        name	: { type: 'string',required : true },

        phone	: { type: 'string' },

        email	: { type: 'string' , required : true },

        client : { model : 'Client_' }

    }

};