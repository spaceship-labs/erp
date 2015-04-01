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
                        name:req.__('cupon_instancia'),
                        icon:'fa fa-ticket',
                        controller : 'cupon.js'
                    },
                    breadcrumb :[
                        { label: 'Instancias de cupones' }
                    ]
                },req);
            });
        });
    },
    create: function(req,res){
        var form = req.params.all();
        //dumpArray = new Array(parseInt(form.count));
        form.multiple = form.multiple?true:false;
        delete form.id;
        if(form.token){
            CuponSingle.findOne({token:form.token}).exec(function(err,cuponExist){
                if(cuponExist) return res.json(false);
                createCuponAndResponse(form,res);
            });
        }else{
            createCuponAndResponse(form,res);
        }
    },
    edit:function(req,res){
        var id = req.param('id'); 
        CuponSingle.findOne({id:id}).populateAll().exec(function(err,cuponSingle){ 
            Cupon.find().exec(function(err,cupons){
                Common.view(res.view,{
                    cuponSingle:cuponSingle,
                    cupons:cupons,
                    page:{
                        name:req.__('cupon_editInstancia')+cuponSingle.cupon.name,
                        icon:'fa fa-ticket',
                        controller : 'cupon.js'
                    }
                },req);
            });
        });
    },
    validatetoken : function(req,res){
        var token = req.param('token');
        var expiration = req.param('expiration');
        //, expiration:{'>':new Date(expiration)}
        CuponSingle.findOne().where({ token:token }).exec(function(err,exist){
            if (err) console.log(err);
            var result = 't';
            if (exist) result = 'f';
            res.json(result);
        });
    }
};
function createCuponAndResponse(form,res){
    Cupon.findOne({id:form.cupon}).exec(function(err,cuponBase){
        CuponSingle.create(form).exec(function(err,cupon){
            cupon.name = cuponBase.name;
            res.json([cupon]);
        }); 
    });
}
