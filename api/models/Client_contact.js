module.exports = {

    attributes: {

        name	: { type: 'string',required : true },

        phone	: { type: 'string' },

        email	: { type: 'string' , required : true },

        //type : { type : 'string', enum : ['contact','sale']  },

        client : { model : 'Client_' }

    }

};