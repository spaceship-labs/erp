/*
*   La idea es reemplazar los puntos geograficos en json por este objeto
*
* */
module.exports = {
    attributes: {
        name : 'string',
        name_en : 'string',
        description : 'string',
        latitude : 'string',
        longitude : 'string',
        type : {
            type : 'string',
            enum: ['none', 'marine','transfer_site'],
            defaultsTo : 'none'
        },
        //transfer place time to travel there
        time : 'datetime',
        //relaciones
        tour : {
            model : 'Tour'
        }
    }
};