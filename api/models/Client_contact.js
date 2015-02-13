module.exports = {

    attributes: {

        name	: { type: 'string',required : true },

        phone	: { type: 'string' },

        phone_extension	: { type: 'string' },

        email	: { type: 'string' , required : true },

        work_position : { type : 'string' },

        type : { type : 'string', enum : ['contact','sale','all'],defaultsTo : 'all'  },

        client : { model : 'Client_' }

    }

};