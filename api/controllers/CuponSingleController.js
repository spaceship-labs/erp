/**
 * CuponSingleController
 *
 * @description :: Server-side logic for managing Cuponsingles
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var async = require('async');
module.exports = {
    index:function(req,res){
        CuponSingle.find().exec(function(err,cuponsSingle){
            Cupon.find().exec(function(err,cupons){
                Common.view(res.view,{
                    cuponsSingle:cuponsSingle,
                    cupons:cupons,
                    page:{
                        name:'Instancia de cupones',
                        icon:'fa fa-ticket',
                        controller : 'cupon.js'
                    }
                },req);
            });
        });
    },
    create: function(req,res){
        console.log(req.params.all());
        var form = req.params.all(),
        dumpArray = new Array(parseInt(form.count));
        async.eachSeries(dumpArray,function(i,next){
            console.log('cccc');
            CuponSingle.create({cupon:form.cupons}).exec(function(err,cupon){
                next(err);
            });
        },function(err){
            res.json(err || true);
        });
    }
};
