/**
 * PackageTourController
 *
 * @description :: Server-side logic for managing Packagetours
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = {
  /**
   * `PackageTourController.index()`
   */
  index: function (req, res) {
    PackageTour.find().exec(function(e,packages){
      Common.view(res.view,{
        packages : packages,
        page:{
          name:'Paquetes'
          ,description: 'Administracion de contenido paquetes de tours'
          ,icon:'fa fa-dropbox'
          ,controller : 'packagetour.js'
        },
        breadcrumb : [
          {label : 'Paquetes'}
        ]
      },req);
    });
  },

  /**
   * `PackageTourController.edit()` 
   */
  edit: function (req, res) {
    PackageTour.findOne(req.params.id).populate('items').exec(function(e,package_t){
      Location.find().sort('name').exec(function(e,locations){
          if(e) return res.redirect("/packagetour/");
          Common.view(res.view,{
            package_t:package_t,
            locations : locations,
            items : groupItems(package_t.items) ,
            page:{
              name:package_t.name,
              icon:'fa fa-dropbox',
              controller : 'packagetour.js'
            },
            breadcrumb : [
              {label : 'Paquetes', url: '/packagetour/'},
              {label : package_t.name},
            ]
          },req); 
      });
    });
  },
  update : function(req,res){
    var form = req.params.all();
    form.req = req;
    PackageTour.update({id:form.id},form,function(e,p){
      if(e) throw(e);
      PackageTour.findOne(p.id).populate('items').exec(function(e,package_t){
        if(e) throw(e);
        res.json(item);
      });
    });
  }
};
function groupItems(items){
  result = _.groupBy(items, function(item){ return item.type; });
  return result;
}