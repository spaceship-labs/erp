/**
 * ProductController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	index: function(req,res){
		Sales_type.find().exec(function(err,sales_type){
			if(err) throw err;
			Common.view(res.view,{
				page:{
					icon:'fa fa-cubes'
					,name:'Productos'
				},				
				sales_type:sales_type
			});		
		});
	}

	,indexJson: function(req,res){
		var select_company = req.session.select_company || req.user.select_company;
		Custom_fields.find({company:select_company}).exec(function(err,fields){
			res.json(fields);	
		});
	}

	,products: function(req,res){
		Sales_type.find().exec(function(err,sales_type){
			Common.view(res.view,{
				page:{
					icon:'fa fa-cubes'
					,name:'Productos'
				},	
				sales_type:sales_type
			});			
		});
	}
	,productsJson: function(req,res){
		var find = {}
		, form = req.params.all();
		find.company = req.session.select_company || req.user.select_company;
		if(form.type)
			find.sales_type = form.type;
		Product_type.find(find).exec(function(err,products){
			if(err) return res.json(false);
			res.json(products);
		});
	}

	,productJson: function(req,res){
		var id = req.param('id');
		Product_type.findOne({id:id}).exec(function(err,product){
			if(err || !product) return res.json(false);
			Custom_fields.find({product:id})
			.exec(function(err,fields){
				if(err) return res.json(false);
				product.fields = fields;
				Sales_type.find({type:{$in:product.sales_type}}).exec(function(err,sales){
					product.sales_type = sales;
					res.json(product);
				});
			});
			
		});
	}

	,filters: function(req,res){
		var select_company = req.session.select_company || req.user.select_company;
		Custom_fields.find({user:req.user.id,company:select_company}).exec(function(err,custom_fields){
			Common.view(res.view,{
				page:{
					icon:'fa fa-cubes'
					,name:'Productos'
				},			
				fields:custom_fields
			});
		});
	}

	,createField: function(req,res){
		var form = req.params.all();
		form = formValidate(form,['name','type','values','product']);
		if(form.values){
			form.values = form.values.split(',');
		}
		Custom_fields.create(form).exec(function(err,field){
			if(err) return res.json({text:'Ocurrio un error.'});
			res.json({text:'Campo agregado.'});
		});
	}
	,createProductType: function(req,res){
		var form = req.params.all()
		, sales_type = (form.sales_type && form.sales_type.pop)?form.sales_type:[form.sales_type];
		form = formValidate(form,['name','sales_type','fields','description']);
		for(var i=0;i<sales_type.length;i++){
			form[sales_type[i]] = true;
		}
		form.company = req.session.select_company || req.user.select_company;
		form.user = req.user.id;
		Product_type.create(form).exec(function(err,product){
			if(err) return res.json({text:'Ocurrio un error.'});
			res.json({text:'Producto agregado.',url:'product/editCategory/'+product.id});
		});
	}
	,createProduct: function(req,res){
		var form = req.params.all();
		delete form.id;
		delete form._;
		if(form){
			form.user = req.user.id;
			form.company = req.session.select_company || req.user.select_company;
			Product.create(form).exec(function(err,product){
				if(err) return res.json('Ocurrio un error.');
				res.json('Producto creado.');	
			});	
		}
	}
	,editCategory: function(req,res){
		var id = req.param('id');
		if(id){
			Sales_type.find().exec(function(err,sales_type){
				if(err) throw err;
				Product_type.findOne({id:id}).exec(function(err,product){
					Common.view(res.view,{
						product:product
						,types:Custom_fields.attributes.type.enum
						,sales_type:sales_type
					});
				});
			});
				
		}else
			res.notFound();
	}
	, updateCategory: function(req,res){
		var form = req.params.all();
		if(form.catID){
			form = formValidate(form,['catID','name','sales_type','description']);
			Product_type.update({id:form.catID},form).exec(function(err,sale){
				if(err) return res.json({text:'Ocurrio un error.'});
				res.json({text:'Categoria actualizada.'});
			});	
		}
	}
	, editCategoryJson: function(req,res){
		var id = req.param('catID');	
		Custom_fields.find({product:id}).exec(function(err,fields){
			res.json(fields);
		});	
	}
	, removeField: function(req,res){
		var fieldID = req.param('fieldID');
		Custom_fields.destroy({id:fieldID}).exec(function(err){
			if(err) return res.json({text:'Ocurrio un error.'});
			res.json({text:'Campo eliminado.'});
		});
	}
};

function formValidate(form,validate){
	for(var i in form){
		if(validate.indexOf(i)==-1)
			delete form[i];
	}
	return form;
}
