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
      SaleClient.find({ company : select_company }).exec(function (err,clients){
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
        var form = Common.formValidate(req.params.all(),['client']);

        if(form){
            form.company = req.session.select_company || req.user.select_company;
            form.user = req.user;
            Sale.create(form).exec(function(err,newsale){
                if(err) {
                    console.log('error al crear la venta');
                    return res.json({text:'Ocurrio un error.'});
                }

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
                    sale : newsale.id
                };

//                SaleClient.find({id : form.client}).populate('sales').exec(function(err,client){
//                    console.log(client.sales);
//                    client.sales.push(newsale);
//                    client.save();
//                });

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
                      //performance killa

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
      },

      clients : function(req,res){
          var select_company = req.session.select_company || req.user.select_company;
          SaleClient.find({ company : select_company }).exec(function (err,clients){
              Common.view(res.view,{
                  page:{
                      icon:'fa fa-users'
                      ,name:'Clientes'
                  },
                  clients : clients || []
              },req);
          });

      },

      addClient : function(req,res){
          Common.view(res.view,{
              page:{
                  icon:'fa fa-users'
                  ,name:'Cliente'
              }
          },req);
      },



    editClient : function(req,res){
        var id = req.param('id');
        var company = req.session.select_company || req.user.select_company;
        if (id){
            SaleClient.findOne({id:id,company : company }).exec(function(err,saleClient){
                Sale.find().exec(function (err,sales){
                    Common.view(res.view,{
                        page:{
                            icon:'fa fa-users'
                            ,name:'Editar Cliente'

                        },
                        client : saleClient || [],
                        sales : sales || []
                    },req);
                });
            });
        } else
            res.notFound();
    },

    updateClient: function(req,res){
        var form = Common.formValidate(req.params.all(),['id','name','address','phone','rfc']);
        if(form){
            Sale.update({id:form.id},form).exec(function(err,saleClient){
                if(err) return res.json({text:'Ocurrio un error.'});
                res.json({text:'Cliente actualizado.'});
            });
        }
    },

    createClient : function(req,res){
        var form = Common.formValidate(req.params.all(),['name','address','phone','rfc']);
        if(form){
            form.user = req.user.id;
            form.company = req.session.select_company || req.user.select_company;
            SaleClient.create(form).exec(function(err,saleClient){
                if(err) return res.json({text:err});
                res.json({text:'Cliente creado.',url:'/clientes/editar/'+saleClient.id});
            });
        }
    },

    clientsJson: function (req, res) {
        var select_company = req.session.select_company || req.user.select_company;
        SaleClient.find({ company : select_company }).exec(function(err,sales){
            res.json(sales);
        });
    }

};
