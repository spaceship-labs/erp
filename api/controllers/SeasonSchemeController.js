/**
 * SeasonSchemeController
 *
 * @description :: Server-side logic for managing seasonschemes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var async = require('async');
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
    });
  },
  edit : function(req,res){
    SeasonScheme.findOne(req.params.id).populate('seasons').exec(function(e,scheme){ //.populate('hotels')
      if(e) throw(e);
      //Hotel.find().exec(function(e,hotels){ if(e) throw(e);
        Common.view(res.view,{
          scheme:scheme,
          hotels:[],
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
      //});
    });
  },
  cloneScheme : function(req,res){
    var params = req.params.all();
    var schemeID = params.id;
    //res.json(schemeID);
    SeasonScheme.findOne(schemeID).populate('seasons').exec(function(e,scheme){
      if(e) throw (e);
      var schemeAux = { name : scheme.name + ' - copy ' };
      SeasonScheme.create( schemeAux ).exec(function(err,newScheme){
        if(err) throw(err);
        async.mapSeries( scheme.seasons, function(item,cb) {
          var seasonAux = { title : item.title, start : item.start|| new Date() , end : item.end || new Date(), scheme : newScheme.id };
          Season.create( seasonAux ).exec(cb);
        },function(err,results){
          if(err) res.json({ err : err , result : false });
          SeasonScheme.findOne( newScheme.id ).populate('seasons').exec(function(err,theScheme){
            res.json({ err : err , result : theScheme });
          });
        });//async
      });//create
    });//findOne
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

