/**
 * Product_typeController.js 
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
					description: '',
					icon:'fa fa-cubes',
					name:'Categorias'
				},
				sales_type:sales_type
			},req);		
		});
	},
	edit: function(req,res){
		var id = req.param('id');
		if(id){
			Sales_type.find().exec(function(err,sales_type){
				if(err) throw err;
				Product_type.findOne({id:id}).exec(function(err,product){
					Common.view(res.view,{
						product:product
						,types:Custom_fields.attributes.type.enum
						,sales_type:sales_type
					},req);
				});
			});
				
		}else
			res.notFound();
	}
	, update: function(req,res){
		var form = req.params.all();
		if(form.catID){
			var id = form.catID;
			form = formValidate(form,['name','sales_type','description']);
			Product_type.update({id:id},form).exec(function(err,sale){
				if(err) return res.json({text:'Ocurrio un error.'});
				res.json({text:'Categoria actualizada.'});
			});	
		}
	}
	, editJson: function(req,res){
		var id = req.param('catID');	
		Custom_fields.find({product:id}).exec(function(err,fields){
			res.json(fields);
		});	
	}
	,createField: function(req,res){
		var form = req.params.all()
		, Model = Product_type;
		form = Common.formValidate(form,['name','type','handle','values','product','productSingle']);
		if(form.values){
			form.values = form.values.split(',');
		}
		if(form.productSingle == 1)
			Model = Product;
		var pid = form.product
		, tmp = form.productSingle;
		delete form.productSingle;
		delete form.product;

		Model.findOne(pid).exec(function(e,p){
			if(e) throw(e);
			p.fields = p.fields || [];
			p.fields.push(form);
			p.save(function(e,p){
				/*if(e) return res.json({text:'Ocurrio un error.'});
				res.json({text:'Campo agregado.'});	*/
				res.redirect((tmp?'/product/edit/':'/product_type/edit/')+pid);
			})
		});
	}
	, removeField: function(req,res){
		var form = req.params.all()
		, Model = Product_type;
		if(form.productSingle == 1)
			Model = Product;
		Model.findOne({id:form.product_type}).exec(function(err,product_type){
			var index = product_type.fields.map(function(p){ return p.name}).indexOf(form.name);
			if(index!=-1)
				product_type.fields.splice(index,1);
			product_type.save(function(err){
				if(err) return res.json({text:'Ocurrio un error.'});
				res.json({text:'Campo eliminado.',fields:product_type.fields});

			});

		});
	}
	
	
};
