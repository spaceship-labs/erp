/**
 * ClientController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {



    /**
     * `ClientController.index`
     */

    index: function (req, res) {
        Common.view(res.view,{
            page:{
                icon:'iconfa-inbox-large'
                ,name:'Ventas'
            }
        },req);
    },

    indexJson: function (req, res) {
        return res.json({
            todo: 'Not implemented yet!'
        });
    },

  /**
   * `ClientController.add`
   */

  add: function (req, res) {
      var form = req.params.all() || {}
          , response = {
              status:false
              , msg:'ocurrio un error'
          };
      delete form.id;
      form.active = 1;
      form.req = req;
      Sale.create(form).exec(function(err,client){
          if(err) return res.json(response);
          update.icon(req,{clientId:client.id},function(err,files){
              if(err)  return res.json(response);
              res.json({
                  status:true
                  , msg:'La venta se creo exitosamente'
              });
          });


      });
  },




  /**
   * `ClientController.edit`
   */

  edit: function (req, res) {
      var id = req.params.id;
      Sale.findOne({id:id}).exec(function(err,sale){
          if(err) throw err;
          var find = {}
          find['sale.'+id] = {$exists:1};
          User.find(find).exec(function(err,users){
              Apps.find({controller:{$in:company.app}}).exec(function(err,apps){
                  Apps.find({controller:{'!':company.app}}).exec(function(err,allApps){
                      Common.view(res.view,{
                          company:company || {}
                          , users:users || []
                          ,apps: apps||[]
                          ,allApps:allApps || []
                      },req);
                  });
              });
          });
      });
  }
};
