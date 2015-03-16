/**
 * SeasonSchemeController
 *
 * @description :: Server-side logic for managing seasonschemes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
  index : function(req,res){
    SeasonScheme.find().exec(function(e,schemes){
      if(e) throw(e);
      Common.view(res.view,{
        schemes:schemes,
        page:{
          name:'Esquemas de Temporadas'
          ,icon:'fa fa-sun-o'   
          ,controller : 'season.js'         
        },
        breadcrumb : [
          {label : 'Temporadas'}
        ]
      },req);
    })
    
  },

  edit : function(req,res){
    SeasonScheme.findOne(req.params.id).populate('seasons').populate('hotels').exec(function(e,scheme){
      if(e) throw(e);
      Hotel.find().exec(function(e,hotels){
        if(e) throw(e);
        Common.view(res.view,{
          scheme:scheme,
          hotels:hotels,
          page:{
            name:'Esquema: '+scheme.name
            ,icon:'fa fa-sun-o'   
            ,controller : 'season.js'         
          },
          breadcrumb : [
            {label : 'Temporadas', url : '/seasonScheme/'},
            {label : 'Temporadas'}
          ]
        },req);
      });
       
    })
    
  },
  calendar : function(req,res){
    Common.view(res.view,{
      page:{
        name:'Calendario: '
        ,description: 'AQUI PODRAS VISUALIZAR Y ADMINISTRAR TODO TU PROCESO DE VENTA'
        ,icon:'fa fa-sun-o'   
        ,controller : 'season.js'         
      },
      breadcrumb : [
        {label : 'Temporadas', url : '/seasonScheme/'},
        {label : 'Temporadas'}
      ]
    },req);
  }
};

