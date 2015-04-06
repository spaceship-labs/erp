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
                    ,controller : 'installation.js'
                },
                installations : installations || [],
                moment : moment
            },req);
        });
    },

    configure: function (req, res) {
        var select_company = req.session.select_company || req.user.select_company;
        var asyncTasks = [];
        var installation_hoursR = []
            ,installation_zonesR = []
            ,installation_work_typesR = []
            ,installation_toolsR = []
            ,installation_materialsR = []
            ,installation_cranesR = []
            ,productsR = [];

        asyncTasks.push(function(cb){
            Installation_hour.find({company : select_company}).exec(function(err,installation_hours){
                if(err) throw err;
                installation_hoursR = installation_hours;
                cb();
            });
        });

        asyncTasks.push(function(cb){
            Installation_zone.find({ company : select_company }).exec(function (err,installation_zones){
                if(err) throw err;
                installation_zonesR = installation_zones;
                cb();
            });
        });

        asyncTasks.push(function(cb){
            Installation_work_type.find({ company : select_company }).exec(function (err,installation_work_types){
                if(err) throw err;
                installation_work_typesR = installation_work_types;
                cb();
            });
        });

        asyncTasks.push(function(cb){
            Installation_tool.find({ company : select_company }).populate('product').exec(function (err,installation_tools){
                if(err) throw err;
                installation_toolsR = installation_tools;
                cb();
            });
        });

        asyncTasks.push(function(cb){
            Installation_material.find({ company : select_company }).populate('product').exec(function (err,installation_materials){
                if(err) throw err;
                installation_materialsR = installation_materials;
                cb();
            });
        });

        asyncTasks.push(function(cb){
            Installation_crane.find({ company : select_company }).exec(function (err,installation_cranes){
                if(err) throw err;
                installation_cranesR = installation_cranes;
                cb();
            });
        });

        asyncTasks.push(function(cb){
            Product.find({ company : select_company }).populate('price').exec(function (err,products){
                if(err) throw err;
                productsR = products;
                cb();
            });
        });

        async.parallel(asyncTasks,function(){
            Common.view(res.view,{
                page:{
                    icon:'fa fa-wrench'
                    ,name:'Configuracion de Instalaciones'
                    ,controller : 'installation.js'
                },
                cranes : installation_cranesR || [],
                materials : installation_materialsR || [],
                tools : installation_toolsR || [],
                work_types : installation_work_typesR || [],
                zones : installation_zonesR || {},
                hours : installation_hoursR || {},
                products : productsR
            },req);
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
                    ,controller : 'installation.js'
                },
                installation : installation || [],
                moment : moment
            },req);
        });
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
                        if (err) {
                            console.log(err);
                        }
                        savedCranes.push(fcrane);
                        callback(err);
                    });
                } else {
                    crane.company = select_company;

                    Installation_crane.create(crane).exec(function(err,fcrane){
                        if (err) {
                            console.log(err);
                        }
                        savedCranes.push(fcrane);
                        callback(err);
                    });
                }
            },function(err) {
                if (err) return res.json({text: 'Ocurrio un error.',error : err});
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
    },

    delete_element : function(req,res) {
        var element = req.param('e');
        var id = req.param('id');
        var validElements = ['crane','hour','material','tool','zone','work_type'];
        console.log(validElements.indexOf(element));
        if (validElements.indexOf(element) > -1) {
            var modelName = 'installation_' + element;

            console.log(sails.models[modelName]);
            sails.models[modelName].destroy({ id : id }).exec(function(err,modelres){
                if (err) return res.json({text : 'error yo',msg : err});
                return res.json({text: " Eliminado con exito "});
            });
        }
        res.json({text : 'error no'});
        //if (id && element.co)
    }
};
