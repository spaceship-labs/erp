/**
 * TransportAsignController
 *
 * @description :: Server-side logic for managing Transportasigns
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var async = require('async');
module.exports = {
    index: function(req, res){
        async.parallel({
            companies: function(done){
                Company.find().exec(done);
            },
            vehicles : function(done){
                Transport.find().exec(done);
            }
        
        }, function (err, data){
            Common.view(res.view,{
                companies: data.companies,
                all_vehicles: data.vehicles,
                locations : [],
                type: 'asign',
                page:{
                    name:req.__('sc_transfer')
                    ,icon:'fa fa-clock-o'
                    ,controller : 'transportasign.js'
                },
                breadcrumb : [
                    {label : req.__('sc_transfer')}
                ]
            },req);
        
        });
    },
    assign : function(req,res){
        var params = req.params.all();
        AssignCore.assignReservation(params,function(err,reservation){
            console.log(err);
            res.json(reservation);
        });
    },
    getReservations : function(req,res){
        var params = req.params.all();
        delete params.id;
        AssignCore.getReservationsDivided( params, req.user, function(err,reservations){
            res.json( reservations );
        });
    },
    getVehicles : function(req,res){
        var params = req.params.all()
        delete params.id;
        AssignCore.getVehicles(params,function(err,vehicles){
            res.json( vehicles );
        });
    },
    test: function(req, res){
        console.log(req.allParams());
        res.ok();
    },

    show_companies: function(req, res){
        var defer;
        if(req.user.isAdmin){
            defer = Company.find({ company_type : 'transport' });
        }else{
            var company = req.session.select_company || req.user.select_company;
            defer = Company.find({id: company}).limit(1);
        }
        defer.exec(function(err, companies){
            res.json(companies);
        });
    }
};
