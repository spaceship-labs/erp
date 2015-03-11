/**
* CuponSingle.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {
        cupon:{
            model:'cupon'
        },
        token:{
            type:'string',
            unique:true
        },
        expiration:'date',
        multiple:'boolean',
        description:'string'
    },
    beforeCreate:function(val,cb){ 
    	if(val.token) return cb();
        CuponSingle.find().limit(1).sort('createdAt desc').exec(function(err,cupon){
            var base;
            if(!cupon.length)
                base = '1004';
            else
                base = cupon[0].token;
            
            base = parseInt(base,16) + 1;
            var uid = simpleUuid(base);
            val.token = uid.toString(16);
            cb();
        })
    }
};

function simpleUuid(base){
    var letters = ['1010','1011','1100','1101','1110','1111'],
    count = 0;
    while(1){
        var base2 = base.toString(2);
        for(var i=base2.length;i>0;i-=4){
            var tmp = base2.substring(i-4,i);
            if(letters.indexOf(tmp)!=-1){
                return base;
            }
        }
        base++;
        count++;
        if(count == 20)
            return base;
	}
}
