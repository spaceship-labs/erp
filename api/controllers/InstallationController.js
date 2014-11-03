/**
 * InstallationController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */


var moment = require('moment');
var async = require('async');

module.exports = {

    index : function(req,res) {
        var select_company = req.session.select_company || req.user.select_company;
        Installation.find({ company : select_company }).populateAll().exec(function(err,installations){
            Common.view(res.view,{
                page:{
                    icon:'fa fa-wrench'
                    ,name:'Instalaciones'
                },
                installations : installations || [],
                moment : moment
            },req);
        });
    },

    configure: function (req, res) {
        var select_company = req.session.select_company || req.user.select_company;
        Installation_crane.find({ company : select_company }).exec(function (err,cranes){
                Installation_material.find({ company : select_company }).populate('product').exec(function (err,materials){
                    Installation_tool.find({ company : select_company }).populate('product').exec(function (err,tools){
                        Installation_work_type.find({ company : select_company }).exec(function (err,work_types){
                            Installation_zone.find({ company : select_company }).exec(function (err,zones){
                                Installation_hour.find({company : select_company}).exec(function(err,hours) {
                                    Product.find({company : select_company}).populateAll().exec(function(err,products) {
                                        Common.view(res.view,{
                                            page:{
                                                icon:'fa fa-wrench'
                                                ,name:'Configuracion de Instalaciones'
                                            },
                                            cranes : cranes || [],
                                            materials : materials || [],
                                            tools : tools || [],
                                            work_types : work_types || [],
                                            zones : zones || {},
                                            hours : hours || {},
                                            products : products
                                        },req);
                                    });
                                });
                            });
                        });
                    });
                });
        });

    },

    create : function(req,res) {
        var form = req.param('installation');
        form.company = req.session.select_company || req.user.select_company;
        form.user = req.user.id;
        Installation.create(form).exec(function(err,result) {
            if(err) return res.json({text:'Ocurrio un error.'});
            res.json({text:'Instalacion creada.',data : result});
        });
    },

    edit : function(req,res) {
        var select_company = req.session.select_company || req.user.select_company;
        var id = req.param('id');
        Installation.findOne({ company : select_company,id : id }).populateAll().exec(function(err,installation){
            Common.view(res.view,{
                page:{
                    icon:'fa fa-wrench'
                    ,name:'Instalacion'
                },
                installation : installation || [],
                moment : moment
            },req);
        });
    },

    update : function (req,res){
        var form = req.param('machine');
        if(form){
            Machine.update({id:form.id},{ name : form.name , description : form.description , internalReference : form.internalReference , product_types : form.product_types, ink_cost : form.ink_cost,ink_utility : form.ink_utility }).exec(function(err,machine){
                if(err) return res.json({text:'Ocurrio un error.'});
                res.json({text:'Impresora actualizada.'});
            });
        }
    },

    update_zones : function (req,res){
        var form = req.param('zones');
        var select_company = req.session.select_company || req.user.select_company;
        var savedZones = [];

        if(form){
            async.each(form,function(zone,callback){
                if (zone.id) {
                    Installation_zone.update({id : zone.id},zone).exec(function(err,fzone){
                        savedZones.push(zone);
                        callback();
                    });
                } else {
                    zone.company = select_company;
                    Installation_zone.create(zone).exec(function(err,fzone){
                        savedZones.push(fzone);
                        callback();
                    });
                }
            },function(err) {
                if (err) return res.json({text: 'Ocurrio un error.'});
                res.json({text: 'Zonas de trabajo actualizadas.',zones : savedZones});
            });
        }
    },

    update_materials : function(req,res) {
        var form = req.param('materials');
        var select_company = req.session.select_company || req.user.select_company;
        var savedMaterials = [];

        if(form){
            async.each(form,function(material,callback){
                if (material.id) {
                    Installation_material.update({id : material.id},material).exec(function(err,fmaterial){
                        savedMaterials.push(material);
                        callback();
                    });
                } else {
                    material.company = select_company;
                    Installation_material.create(material).exec(function(err,fmaterial){
                        savedMaterials.push(fmaterial);
                        callback();
                    });
                }
            },function(err) {
                if (err) return res.json({text: 'Ocurrio un error.'});
                res.json({text: 'Materiales de trabajo actualizados.',materials : savedMaterials});
            });
        }
    },

    update_tools : function(req,res) {
        var form = req.param('tools');
        var select_company = req.session.select_company || req.user.select_company;
        var savedTools = [];

        if(form){
            async.each(form,function(tool,callback){
                if (tool.id) {
                    Installation_tool.update({id : tool.id},tool).exec(function(err,ftool){
                        savedTools.push(tool);
                        callback();
                    });
                } else {
                    tool.company = select_company;
                    Installation_tool.create(tool).exec(function(err,ftool){
                        savedTools.push(tool);
                        callback();
                    });
                }
            },function(err) {
                if (err) return res.json({text: 'Ocurrio un error.'});
                res.json({text: 'Herramientas de trabajo actualizados.',tools : savedTools});
            });
        }
    },

    update_work_types : function (req,res){
        var form = req.param('work_types');
        var select_company = req.session.select_company || req.user.select_company;
        var savedWorkTypes = [];

        if(form){
            async.each(form,function(work_types,callback){
                if (work_types.id) {
                    Installation_work_type.update({id : work_types.id},work_types).exec(function(err,fwork_types){
                        savedWorkTypes.push(work_types);
                        callback();
                    });
                } else {
                    work_types.company = select_company;
                    Installation_work_type.create(work_types).exec(function(err,fwork_types){
                        savedWorkTypes.push(fwork_types);
                        callback();
                    });
                }
            },function(err) {
                if (err) return res.json({text: 'Ocurrio un error.'});
                res.json({text: 'Tipos de trabajo actualizadas.',work_types : savedWorkTypes});
            });
        }
    },

    update_cranes : function (req,res){
        var form = req.param('cranes');
        var select_company = req.session.select_company || req.user.select_company;
        var savedCranes = [];

        if(form){
            async.each(form,function(crane,callback){
                if (crane.id) {
                    Installation_crane.update({id : crane.id},crane).exec(function(err,fcrane){
                        savedCranes.push(crane);
                        callback();
                    });
                } else {
                    crane.company = select_company;
                    Installation_crane.create(crane).exec(function(err,fcrane){
                        savedCranes.push(fcrane);
                        callback();
                    });
                }
            },function(err) {
                if (err) return res.json({text: 'Ocurrio un error.'});
                res.json({text: 'Gruas actualizadas.',cranes : savedCranes});
            });
        }
    },

    update_hours : function (req,res){
        var form = req.param('hours');
        var select_company = req.session.select_company || req.user.select_company;
        var savedHours = [];

        if(form){
            async.each(form,function(hour,callback){
                if (hour.id) {
                    Installation_hour.update({id : hour.id},hour).exec(function(err,fhour){
                        savedHours.push(hour);
                        callback();
                    });
                } else {
                    hour.company = select_company;
                    Installation_hour.create(hour).exec(function(err,fhour){
                        savedHours.push(fhour);
                        callback();
                    });
                }
            },function(err) {
                if (err) return res.json({text: 'Ocurrio un error.'});
                res.json({text: 'Categorias de horarios actualizadas.',hours : savedHours});
            });
        }
    }
};
