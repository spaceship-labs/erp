/**
 * Product_typeController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	index: function(req,res){
		Product_type.find().exec(function(err,product_types){
			if(err) throw err;
                Sales_type.find().exec(function(err,sales_type){
                    Inventory_type.find().exec(function (err,inventory_type){
                        Common.view(res.view,{
                            page:{
                                icon:'fa fa-cubes',
                                name:'Categorias'
                            },
                            product_types: product_types,
                            sales_type : sales_type,
                            inventory_type : inventory_type
                        },req);
                    });
                });
        });
	},
	edit: function(req,res){
		var id = req.param('id');
		if(id){
			Sales_type.find().exec(function(err,sales_type){
				if(err) throw err;
				Product_type.findOne({id:id}).populate('fields').populate('machines').exec(function(err,product){
                    if (err) throw err;
                    Inventory_type.find().exec(function (err,inventory_type){
                        Common.view(res.view,{
                            page:{
                                icon:'fa fa-cubes',
                                name:'Editar Categoria'
                            },
                            product_type:product
                            ,product : product //hack para la vista new_field
                            ,types:Custom_fields.attributes.type.enum
                            ,sales_type:sales_type
                            ,inventory_type : inventory_type
                        },req);
                    });
				});
			});
				
		}else
			res.notFound();
	}
	, update: function(req,res){
		var form = req.params.all();
        //console.log(form);
		if(form.id){
			var id = form.id;
			form = Common.formValidate(form,['name','sales_type','description','inventory_use','inventory_type']);
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
