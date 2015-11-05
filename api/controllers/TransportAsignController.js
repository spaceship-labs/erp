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
            }
        
        }, function (err, data){
            Common.view(res.view,{
                companies: data.companies,
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
    
    test: function(req, res){
        console.log(req.allParams());
        res.ok();
    },

    show_companies: function(req, res){
        var defer;
        if(req.user.isAdmin){
            defer = Company.find();
        }else{
            var company = req.session.select_company || req.user.select_company;
            defer = Company.find({id: company}).limit(1);
        }
        defer.exec(function(err, companies){
            res.json(companies);
        });
    }
};
