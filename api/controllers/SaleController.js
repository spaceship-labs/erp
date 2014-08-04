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

    /*
     var products = [];
     //var auxProducts = req.param('products');//falta la funcion map en angular , y no se por que no uso la de jquery
     _.map(req.param('products'),function(p){
     products.push({
     product : p.id,
     quantity : p.quantity,
     price : p.price,
     name : p.name
     });
     });

     //creamos la cotizacion
     var quote = {
     company : form.company,
     user : form.user,
     products : products,
     sale : newsale.id,
     client:form.client
     };

     SaleQuote.create(quote).exec(function(err,saleQuote){
     if (err) {
     return res.json({text : 'Ocurrio un error.',message : err.message});
     }
     var quotes = [];
     quotes.push(saleQuote.id);
     Sale.update({id : newsale.id},{ quotes : quotes }).exec(function(err,sale){
     if (err) {
     return res.json({text : 'Ocurrio un error.'});
     }
     return res.json({text:'Venta creada.',url:'/ventas/editar/'+newsale.id});
     });

     });

    * */

};
