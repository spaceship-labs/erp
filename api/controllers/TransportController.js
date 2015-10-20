/**
 * TransportController
 *
 * @description :: Server-side logic for managing Transports
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var async = require('async');
module.exports = {
    index: function(req, res){
        async.parallel({
            transports: function(done){
                Transport.find().sort('name').exec(done);    
            },
            companies: function(done){
                var defer;
                if(req.user.isAdmin){
                    defer = Company.find();
                }else{
                    var company = req.session.select_company || req.user.select_company;
                    defer = Company.find({id: company}).limit(1);
                }
                defer.exec(done);

            }
        
        }, function(err, data){
            Common.view(res.view,{
                transports: data.transports,
                show_companies: data.companies,
                page:{
                    name:req.__('sc_transfer')
                    ,icon:'fa fa-car'
                    ,controller : 'transport.js'
                },
                breadcrumb : [
                    {label : req.__('sc_transfer')}
                ]
            },req);        
        }); 
    }
};
