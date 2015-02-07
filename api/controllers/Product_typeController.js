/**
 * Product_typeController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    index: function(req,res){
        var company = req.session.select_company || req.user.select_company;
        Product_type.find({ company : company }).exec(function(err,product_types){
            if(err) throw err;
            //Sales_type.find().exec(function(err,sales_type){
                    Common.view(res.view,{
                        page:{
                            icon:'fa fa-cubes',
                            name:'Categorias',
                            controller : 'product.js'
                        },
                        product_types: product_types,
                        sales_type : ['sale','rent','service'],
                        inventory_type : ['metro','metro2','unit']
                    },req);
            //});
        });
    },
    create : function(req,res) {
        var form = Common.formValidate(req.params.all(),['description','inventory_type','name','sales_type']);
        if (form) {
            //console.log(form);
            form.user = req.user.id;
            form.company = req.session.select_company || req.user.select_company;
            Product_type.create(form).exec(function(err,product_type){
                if(err) return res.json({text:'error',invalidAttributes : err.invalidAttributes});
                res.json({text:'Categoria de producto creada.',url:'/product_type/edit/'+product_type.id});
            });
        }
    },
    edit: function(req,res){
        var id = req.param('id');
        if(id){
            //Sales_type.find().exec(function(err,sales_type){
                //if(err) throw err;
                Product_type.findOne({id:id}).populate('fields').populate('machines').exec(function(err,product_type){
                    Common.view(res.view,{
                        page:{
                            icon:'fa fa-cubes',
                            name: product_type.name,
                            controller : 'product.js'
                        },
                        product_type:product_type
                        ,product : product_type //hack para la vista new_field
                        ,types:Custom_fields.attributes.type.enum
                        ,sales_type:['sale','rent','service']
                        ,inventory_type : ['metro','metro2','unit']
                    },req);
                });
            //});

        }else
            res.notFound();
    }
    , update: function(req,res){
        var form = req.params.all();
        //console.log(form);
        if(form.id){
            var id = form.id;
            form = Common.formValidate(form,['name','sales_type','description','inventory_type']);
            Product_type.update({id:id},form).exec(function(err,product_type){
                if(err) return res.json({text:'Ocurrio un error.'});
                res.json({text:'Categoria actualizada.'});
            });
        } else {
            console.log("nain");
        }

    }
    , editJson: function(req,res){
        var id = req.param('catID');
        Custom_fields.find({product:id}).exec(function(err,fields){
            res.json(fields);
        });
    }
    ,createField: function(req,res){
        var form = req.params.all();
        form = Common.formValidate(form,['name','type','handle','values','product_type']);
        if(form.values){
            form.values = form.values.split(',');
        }
        var pid = form.product_type;

        Custom_fields.create(form).exec(function(err,field){
            Product_type.findOne({id : pid}).exec(function(e,p){
                if(e) throw(e);
                res.json({text:'Campo agregado.',field : field});
            });
        });
    }
    , removeField: function(req,res){
        var form = req.params.all();
        Custom_fields.destroy({id : form.id , product_type : form.product_type}).exec(function(err,cf){
            if (err) return res.json({text:'Ocurrio un error.'});
            res.json({text:'Campo eliminado.'});
        });
    }


};