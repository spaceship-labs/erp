/**
 * TransportTypeController
 *
 * @description :: Server-side logic for managing transporttypes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var async = require('async');
module.exports = {
    index: function(req, res){
        getInfo({},function(err, data){
            Common.view(res.view,{
                transports: data.transports,
                types: data.types,
                transfers: data.transfers,
                page:{
                    name:req.__('transporttype'),
                    icon:'fa fa-car',
                    controller : 'transporttype.js'
                },
                breadcrumb : [
                    {label : req.__('sc_transfer')}
                ]
            },req);
        });
    },
    edit: function(req, res){
        var id = req.params.id;
        if(!id) return res.notFound();

        getInfo({id: id}, function(err, data){
            if(err || !data.types) return res.notFound();
            Common.view(res.view,{
                type: data.types,
                transports: data.transports,
                transfers: data.transfers,
                page:{
                    name:req.__('transporttype'),
                    icon:'fa fa-car',
                    controller : 'transporttype.js'
                },
                breadcrumb : [
                    {label : req.__('sc_transfer') , url : '/transporttype' }
                    ,{label : data.types.name }
                ]
            },req);
        });
    },
    remove_transport: function(req, res){
        var params = req.params.all();
        TransportType.findOne({id:params.obj}).populateAll().exec(function(err, type){
            if(err) return res.json(err);
            type.transports.remove(params.rel);
            type.save(function(err, type){
                if(err) return res.json(err);
                type.transports = type.transports.map(function(t){ t.name = t.car_id; return t;});
                res.json(type);
            });
        });
    }
};

function getInfo(find, done){
    async.parallel({
        types: function(next){
            var defer;
            if(find.id){
                defer = TransportType.findOne(find.id).populateAll();
            }else{
                defer = TransportType.find(find);
            }

            defer.exec(next);
        },
        transports: function(next){
            Transport.find().exec(next);
        },
        transfers: function(next){
            Transfer.find().exec(next);
        }
    }, done);

}
