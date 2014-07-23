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
					});
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
	
	
};
