/**
 * TransportController
 *
 * @description :: Server-side logic for managing Transports
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var async = require('async');
module.exports = {
    index: function(req, res){
        getInfo(req, {}, function(err, data){
            Common.view(res.view,{
                transports: data.transports,
                show_companies: data.companies,
                page:{
                    name:'Vehículos'
                    ,icon:'fa fa-car'
                    ,controller : 'transport.js'
                },
                breadcrumb : [
                    {label : 'Vehículos'}
                ]
            },req);        
        });
    }, 
    
    edit: function(req,res){
        var id = req.params.id;
        if(!id) return res.notFound();

        getInfo(req, {id: id}, function(err, data){
            if(err) return res.notFound();
            Common.view(res.view,{
                transport: data.transports[0] || {},
                show_companies: data.companies,
                page:{
                    saveButton : true,
                    name: 'Vehículo: ' + data.transports.length>0?data.transports[0].car_id:'' ,
                    icon:'fa fa-car',
                    controller : 'transport.js'
                },
                breadcrumb : [
                    {label : 'Vehículos', url : '/Transport' }
                    ,{label : data.transports.length>0?data.transports[0].car_id:'Vehículo' }
                ]
            },req);
            
        });
    },
    updateIcon: function(req,res){
        form = req.params.all();
        Transport.updateAvatar(req,{
            dir : 'transports',
            profile: 'avatar',
            id : form.id,
        },function(e, transport){
            res.json(transport);
        });
	},
    destroyIcon: function(req,res){
        form = req.params.all();
        Transport.destroyAvatar(req,{
            dir : 'transports',
            profile: 'avatar',
            id : form.id,
        },function(e,user){
            if(e) console.log(e);
            return res.redirect("transport/edit/" + user.id);
        });
    }
};

function getInfo(req, transportFind, next){
    async.parallel({
        transports: function(done){
            Transport.find(transportFind).sort('car_id').exec(done);
        },
        companies: function(done){
            var defer;
            if(req.user.isAdmin){
                defer = Company.find({ company_type : 'transport' });
            }else{
                var company = req.session.select_company || req.user.select_company;
                defer = Company.find({id: company}).limit(1);
            }
            defer.exec(done);
        }
    }, next); 
}
