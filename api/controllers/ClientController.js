/**
 * SaleController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var moment = require('moment');
module.exports = {

    index : function(req,res){
        var select_company = req.session.select_company || req.user.select_company;
        Client_.find().populateAll().exec(function (err,clients){
            Common.view(res.view,{
                page:{
                    icon:'fa fa-users'
                    ,name : req.__('sc_clients')
                    ,controller : 'client.js'
                },
                clients : clients || [],
                client : { name:'',address : '',rfc : '',phone : '' }
            },req);
        });

    },

    add : function(req,res){
        Common.view(res.view,{
            page:{
                icon:'fa fa-users'
                ,name:req.__('sc_client')
                ,controller : 'client.js'
            }
        },req);
    },



    edit : function(req,res){
        var id = req.param('id');
        var company = req.session.select_company || req.user.select_company;
        if (id){
            Client_.findOne({id:id,company : company }).populateAll().exec(function(err,client_){
                Product.find({ company : company }).populateAll().exec(function(err,products){
                    Common.view(res.view,{
                        page:{
                            icon:'fa fa-users'
                            ,name:req.__('sc_editclient')
                            ,controller : 'client.js'

                        },
                        client : client_ || [],
                        moment : moment,
                        products : products || []
                    },req);
                });

            });
        } else
            res.notFound();
    },

    update: function(req,res){
        var form = Common.formValidate(req.params.all(),['id','name','address','phone','rfc','comments','city','state','country']);
        if(form){
            Client_.update({id:form.id},form).exec(function(err,client_){
                if(err) return res.json({text:'Ocurrio un error.'});
                res.json({text:'Cliente actualizado.'});
            });
        }
    },

    create : function(req,res){
        var form = Common.formValidate(req.params.all(),['name','address','phone','rfc','comments','email','city','state','country']);
        if(form){
            form.user = req.user.id;
            form.company = req.session.select_company || req.user.select_company;
            var email = form.email;
            delete form.email;
            Client_.create(form).exec(function(err,client_){
                if(err) return res.json({text:err});
                Client_contact.create({ name : client_.name , phone : client_.phone , email : email , client : client_.id }).exec(function(err,contact) {
                    if (err) return res.json({text : err});
                    //console.log(contact);
                    res.json({text:'Cliente creado.',url:'/clientes/editar/'+client_.id});
                });
            });
        }
    },
    add_contact : function(req,res){
        var form = Common.formValidate(req.params.all(),['name','phone','phone_extension','email','client','type','work_position']);
        if(form){
            //console.log(form);
            Client_contact.create(form).exec(function(err,contact) {
                if (err) return res.json({text : err});
                Client_contact.find({ client : contact.client }).exec(function(err,contacts) {
                    if (err) return res.json({text : err});
                    res.json({text:'Contacto creado.', contacts:contacts});
                });
            });
        }
    },
    add_contact2 : function(req,res){
        var form = Common.formValidate(req.params.all(),['name','phone','email','client']);
        if(form){
            //console.log(form);
            Client_contact.create(form).exec(function(err,contact) {
                if (err) return res.json({text : err});
                Client_contact.find({ client : contact.client }).exec(function(err,contacts) {
                    if (err) return res.json({text : err});
                    res.json({text:'Contacto creado.', contacts:contacts});
                });
            });
        }
    },
    add_discounts : function(req,res) {
        var form = Common.formValidate(req.params.all(),['id','discount','product_discounts']);
        if (form) {
            Client_.update({ id : form.id }, { discount : form.discount }).exec(function(err,client) {
                if (err) return res.json({text : err});
                Product_discount.destroy({ client : form.id }).exec(function(err,discounts) {
                    if (err) return res.json({text : err});
                    Product_discount.create(form.product_discounts).exec(function(err,saved_discounts) {
                        if (err) return res.json({text : err});
                        res.json({text : 'descuentos actualizados' });
                    });
                });
            });

        }
    },

    create_quote : function(req,res){
        var form = Common.formValidate(req.params.all(),['name','address','phone','rfc','comments','email']);
        if(form){
            form.user = req.user.id;
            form.company = req.session.select_company || req.user.select_company;
            var email = form.email;
            delete form.email;
            Client_.create(form).exec(function(err,client_){
                if(err) return res.json({text:err});
                Client_contact.create({ name : client_.name , phone : client_.phone , email : email , client : client_.id }).exec(function(err,contact) {
                    if (err) return res.json({text : err});
                    SaleQuote.create({
                        user:   form.user
                        ,client:    client_.id
                        ,deliver_to : client_.id
                        ,deliver_to_contact : contact.id
                        ,bill_to : client_.id
                        ,billt_to_contact : contact.id
                        ,company : form.company
                    }).exec(function(err,quote){
                        if(err) return res.json({msg:'ocurrio un error'});
                        res.json({url:'/SalesQuote/edit/'+quote.id});
                    });
                });
            });


        }
    },

    clientsJson: function (req, res) {
        var select_company = req.session.select_company || req.user.select_company;
        Client_.find({ company : select_company }).exec(function(err,sales){
            res.json(sales);
        });
    },

    edit_contact : function(req,res) {
        var id = req.param('id');
        if (id) {
            Client_contact.find({ id : id }).exec(function(err,contact) {
                if (err) return res.forbidden();
                Common.view(res.view,{
                    page:{
                        icon:'fa fa-user'
                        ,name:req.__('sc_editcontact')
                        ,controller : 'client.js'

                    },
                    contact : contact || []
                },req);
            });
        }
    },
    //TODO validaciones de contactos ya asociados
    delete_contact : function(req,res) {
        var id = req.param('id');
        if (id) {
            Client_contact.destroy({ id : id }).exec(function(err,contact) {
                if (err) return res.json({text : err});
                res.json(contact);
            });
        }
    },
    update_contact : function(req,res){
        var form = Common.formValidate(req.params.all(),['id','name','phone','phone_extension','email','client','type','work_position']);
        var contact_id = form.id;
        delete form.id;
        if(form){
            Client_contact.update({ id : contact_id },form).exec(function(err,contact) {
                if (err) return res.json({text : err});
                res.json({text:'Contacto actualizado.', contact:contact});
            });
        }
    },
    update_contact2 : function(req,res){
        var form = Common.formValidate(req.params.all(),['id','name','phone','email','client']);
        var contact_id = form.id;
        delete form.id;
        if(form){
            Client_contact.update({ id : contact_id },form).exec(function(err,contact) {
                if (err) return res.json({text : err});
                res.json({text:'Contacto actualizado.', contact:contact});
            });
        }
    }
};
