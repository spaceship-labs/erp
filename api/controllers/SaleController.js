/**
 * SaleController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    /**
     * `SaleController.index`
     */

    index: function (req, res) {
        Common.view(res.view,{
            page:{
                icon:'fa fa-cubes'
                ,name:'Ventas'
            }
        },req);
    },

    indexJson: function (req, res) {
        Sale.find().exec(function(err,sales){
            res.json(sales);
        });
    },

  /**
   * `SaleController.add`
   */

  add : function (req,res){
      Common.view(res.view,{
          page:{
              icon:'fa fa-cubes'
              ,name:'Nueva Venta'
          }
      },req);
  },

  create: function (req, res) {
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
   * `SaleController.edit`
   */

  edit : function (req,res){
      Common.view(res.view,{
          page:{
              icon:'fa fa-cubes'
              ,name:'Nueva Venta'
          }
      },req);
  },
  update: function (req, res) {
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
  },

  clients : function(req,res){
      Common.view(res.view,{
          page:{
              icon:'fa fa-cubes'
              ,name:'Clientes'
          }
      },req);
  },

  addClient : function(req,res){
      Common.view(res.view,{
          page:{
              icon:'fa fa-cubes'
              ,name:'Cliente'
          }
      },req);
  },

    editClient : function(req,res){
        Common.view(res.view,{
            page:{
                icon:'fa fa-cubes'
                ,name:'Cliente'
            }
        },req);
    },

    clientsJson : function(req,res){
        Sale_Client.find().exec(function(err,sales){
            res.json(sales);
        });
    }

};
