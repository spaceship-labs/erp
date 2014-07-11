/**
 * SaleController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {


    index: function (req, res) {
        var select_company = req.session.select_company || req.user.select_company;
        Sale.find({ company : select_company }).exec(function (err,sales){
            Common.view(res.view,{
                page:{
                    icon:'fa fa-exchange'
                    ,name:'Ventas'
                },
                sales : sales
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
      SaleClient.find({ company : select_company }).exec(function (err,clients){
          Product.find({ company : select_company }).exec(function (err,products){
              Common.view(res.view,{
                  page:{
                      icon:'fa fa-exchange'
                      ,name:'Nueva Venta'
                  },
                  clients : clients || [],
                  products : products || []
              });
          });
      });

  },

    create : function(req,res){
        console.log(req.params);
        var form = Common.formValidate(req.params.all(),['client_id','products']);
        if(form){
            form.user = req.user.id;
            form.company = req.session.select_company || req.user.select_company;
            var createSale = req.params.fromSale;
            Sale.create(form).exec(function(err,sale){
                if(err) return res.json({text:'Ocurrio un error.'});
                if (createSale) {
                    res.json({text:'Venta creada.',url:'/sale/addnext/'+saleClient.id});
                } else {
                    res.json({text:'Venta creada.',url:'/clients/edit/'+saleClient.id});
                }

            });
        }
    },

      edit : function (req,res){
          var id = req.param('id');
          if (id){
              Sale.findOne({id:id}).exec(function(err,sale){
                  Common.view(res.view,{
                      page:{
                          icon:'fa fa-cubes'
                          ,name:'Nueva Venta'

                      },
                      sale : sale || []
                  });
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
              });
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
                    });
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
                res.json({text:'Cliente creado.',url:'/clients/edit/'+saleClient.id});
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
