module.exports = {

    attributes: {

        name : {
            type: 'string',
            required : true
        },

        value	: {
            type: 'float',
            required : true
        },

        company : {
            model : 'Company'
        }
    }

};