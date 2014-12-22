/**
 * SaleController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var moment = require('moment');
module.exports = {


    index: function (req, res) {
        var select_company = req.session.select_company || req.user.select_company;
        Sale.find({ company : select_company }).populate('user').populate('client').exec(function (err,sales){
            Common.view(res.view,{
                page:{
                    icon:'fa fa-briefcase'
                    ,name:'Ventas'
                },
                sales : sales,
                moment : moment
            },req);
        });

    },

    indexJson: function (req, res) {
        var select_company = req.session.select_company || req.user.select_company;
        Sale.find({ company : select_company }).exec(function(err,sales){
            res.json(sales);
        });
    },

  add : function (req,res){
      var select_company = req.session.select_company || req.user.select_company;
      var select_client = req.param('sc');
      Client_.find({ company : select_company }).exec(function (err,clients){
          Product.find({ company : select_company }).exec(function (err,products){
              Common.view(res.view,{
                  page:{
                      icon:'fa fa-briefcase'
                      ,name:'Nueva Venta'
                  },
                  clients : clients || [],
                  products : products || [],
                  select_client : select_client
              },req);
          });
      });

  },

    create : function(req,res){
        var form = req.params.all();
        if (form.client == 0) {//super hack
            var clientForm = Common.formValidate(req.params.all(),['name','rfc','address','phone']);
            clientForm.company = req.session.select_company || req.user.select_company;
            clientForm.user = req.user.id;
            Client_.create(clientForm).exec(function(err,_client){
                if(err) {
                    return res.json({text:'Ocurrio un error.'});
                }
                var form = {};
                form.client = _client.id;
                form.company = _client.company;
                form.user = _client.user;
                Sale.create(form).exec(function(err,newsale){
                    if(err) {
                        return res.json({text:'Ocurrio un error.'});
                    }
                    return res.json({text:'Venta creada.',url:'/ventas/editar/'+newsale.id});
                });
            });
        } else {
            form = Common.formValidate(req.params.all(),['client']);
            form.company = req.session.select_company || req.user.select_company;
            form.user = req.user;
            Sale.create(form).exec(function(err,newsale){
                if(err) {
                    return res.json({text:'Ocurrio un error.'});
                }
                return res.json({text:'Venta creada.',url:'/ventas/editar/'+newsale.id});
            });
        }
    },

      edit : function (req,res){
          var id = req.param('id');
          var company = req.session.select_company || req.user.select_company;
          if (id){
              Sale.findOne({id:id,company : company})
                  .populate('client')
                  .populate('user')
                  .populate('quotes')
                  .populate('invoices')
                  .populate('workOrders')
                  .exec(function(err,sale){
                    Common.view(res.view,{
                        page:{
                            icon:'fa fa-briefcase'
                            ,name:'Venta'
                          },
                          sale : sale || [],
                          moment : moment
                      },req);
              });
          } else
            res.notFound();
      }

};
