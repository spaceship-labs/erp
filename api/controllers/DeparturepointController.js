/**
 * DeparturepointController
 *
 * @description :: Server-side logic for managing Departurepoints
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  index: function (req, res) {
    DeparturePoint.find().populateAll().sort('name DESC').exec(function(e,dps){
      if(e) throw(e);
      Common.view(res.view,{
        departurepoints : dps,
        page:{
          name:req.__('departure_points')
          ,description: req.__('departure_points_1')
          ,icon:'fa fa-car'
          ,controller : 'departurepoints.js'
        },
        breadcrumb : [
          {label : req.__('departure_points')}
        ]
      },req);
    });
  }
  ,newpoint : function(req,res){
    Location.find().populate('hotels').populate('zones').exec(function(e,ls){
        if(e) throw(e);
        Common.view(res.view,{
          points : ls,
          page:{
            name:req.__('departure_points')
            ,description: req.__('departure_points_1')
            ,icon:'fa fa-car'
            ,controller : 'departurepoints.js'
          },
          breadcrumb : [
            {label : req.__('departure_points')}
          ]
        },req);
    });
  }
  ,edit: function (req, res) {
    var id = req.params.id;
    if(!id) return res.redirect('/departurepoint/');
    DeparturePoint.findOne(id).exec(function(err,dp){
      if(err || !dp) return res.redirect('/departurepoint/');
      Location.find().populate('hotels').populate('zones').exec(function(e,ls){
          if(e) throw(e);
          Common.view(res.view,{
            points : ls,
            dp : dp,
            page:{
              name:req.__('departure_points')
              ,description: req.__('departure_points_1')
              ,icon:'fa fa-car'
              ,controller : 'departurepoints.js'
            },
            breadcrumb : [
              {label : req.__('departure_points')}
            ]
          },req);
      });
    });
  }
  ,create : function(req,res){
    var params = req.params.all();
    delete params.id;
    DeparturePoint.create(params).exec(function(err,dp){
      res.json({ err : err , dp : dp });
    });
  }
};