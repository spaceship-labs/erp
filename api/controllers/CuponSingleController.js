/**
 * CuponSingleController
 *
 * @description :: Server-side logic for managing Cuponsingles
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var async = require('async');
module.exports = {
    index:function(req,res){
        CuponSingle.find().sort('createdAt desc').populateAll().exec(function(err,cuponsSingle){
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
        var form = req.params.all(),
        dumpArray = new Array(parseInt(form.count));
        Cupon.findOne({id:form.cupons}).exec(function(err,cuponBase){
            var generates = [];
            async.eachSeries(dumpArray,function(i,next){
                CuponSingle.create({cupon:form.cupons}).exec(function(err,cupon){
                    cupon.name = cuponBase.name;
                    generates.push(cupon);
                    next(err);
                });
            },function(err){
                if(err) return res.json([]);
                res.json(generates);
            });    
        });
    },
    edit:function(req,res){
        var id = req.param('id'); 
        CuponSingle.findOne({id:id}).populateAll().exec(function(err,cuponSingle){ 
            Cupon.find().exec(function(err,cupons){
                Common.view(res.view,{
                    cuponSingle:cuponSingle,
                    cupons:cupons,
                    page:{
                        name:'Editar cupon de '+cuponSingle.cupon.name,
                        icon:'fa fa-ticket',
                        controller : 'cupon.js'
                    }
                },req);
            });
        });
    }
};
