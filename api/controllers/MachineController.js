/**
 * MachineController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */


var moment = require('moment');
var async = require('async');

module.exports = {

    index: function (req, res) {
        var select_company = req.session.select_company || req.user.select_company;
        Machine.find({ company : select_company }).exec(function (err,machines){
            Common.view(res.view,{
                page:{
                    icon:'fa fa-gears'
                    ,name:'Maquinas'
                },
                machines : machines
            },req);
        });

    },

    indexJson: function (req, res) {
        var select_company = req.session.select_company || req.user.select_company;
        Sale.find({ company : select_company }).exec(function(err,sales){
            res.json(sales);
        });
    },

    create : function(req,res){
        var machine = req.param('machine');
        var modes = req.param('modes');
        var select_company = req.session.select_company || req.user.select_company;

        if (machine) {
            machine.company = select_company;
            Machine.create(machine).exec(function(err,machine){
                if(err) {
                    return res.json({text:'Ocurrio un error.'});
                }

                if (!modes) {
                    return res.json({text:'Maquina creada.',url:'/machine/edit/'+machine.id});
                }

                var modesComplete = modes.map(function(mode){
                    mode.machine = machine.id;
                    return mode;
                });
                MachineMode.create(modesComplete).exec(function(err,modesRes){
                    if(err) {
                        console.log(err);
                        return res.json({text:'Ocurrio un error.'});
                    }
                    var createdModes = modesRes.map(function(mode){
                       return mode.id;
                    });
                    Machine.update({id : machine.id},{ modes : createdModes }).exec(function(err,updatedMachine){
                        if(err) {
                            console.log(err);
                            return res.json({text:'Ocurrio un error.'});
                        }
                        return res.json({text:'Maquina creada.',url:'/machine/edit/'+machine.id});
                    });

                });

            });
        }
    },

    edit : function (req,res){
        var id = req.param('id');
        var company = req.session.select_company || req.user.select_company;
        if (id){
            Machine.findOne({id:id,company : company})
                .populate('modes')
                .exec(function(err,machine){
                    Common.view(res.view,{
                        page:{
                            icon:'fa fa-gear'
                            ,name:'Maquinaria'
                        },
                        machine : machine || {},
                        moment : moment
                    },req);
                });
        } else
            res.notFound();
    },

    update : function (req,res){
        var form = req.param('machine');
        if(form){
            Machine.update({id:form.id},{ name : form.name , description : form.description , internalReference : form.internalReference  }).exec(function(err,machine){
                if(err) return res.json({text:'Ocurrio un error.'});
                res.json({text:'Maquinaria actualizada.'});
            });
        }
    },

    update_modes : function (req,res){
        var form = req.param('modes');
        var machine = req.param('machine');

        var savedModes = [];
        if(form){
            async.each(form,function(mode,callback){
                if (mode.id) {
                    MachineMode.update({id : mode.id},mode).exec(function(err,fmode){
                        savedModes.push(mode.id);
                        callback();
                    });
                } else {
                    mode.machine = machine;
                    MachineMode.create(mode).exec(function(err,fmode){
                        savedModes.push(fmode.id);
                        callback();
                    });
                }
            },function(err) {
                if (err) return res.json({text: 'Ocurrio un error.'});
                Machine.update({id: machine},{modes : savedModes}).exec(function (err, fmachine) {
                    if (err) return res.json({text: 'Ocurrio un error.'});
                    res.json({text: 'Maquinaria actualizada.'});
                });
            });
        }
    }
};
