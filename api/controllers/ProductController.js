/**
 * ProductController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var fs = require('fs')
, im = require('imagemagick');
module.exports = {

	index: function(req,res){
		var select_company = req.session.select_company || req.user.select_company;
		Product_type.find({company:select_company}).exec(function(err,product_types){
			if(err) throw err;
			Product.find({company:select_company}).populate("product_type").exec(function(err,products){
				if(err) throw err;
				Common.view(res.view,{
					page:{
						description:'AQUI PODRAS VISUALIZAR Y ADMINISRAR TODOS TUS PRODUCTOS'
						,icon:'fa fa-cubes'
						,name:'PRODUCTOS'
					}
					, products:products
					, product_types:product_types
				},req);
			});		
		});
	},

	new: function(req,res){
		var select_company = req.session.select_company || req.user.select_company;
		Product_type.find({company:select_company,user:req.user.id}).exec(function(err,product_type){
			if(err) throw(err);
			Common.view(res.view,{
				page:{
					description:'',
					icon:'fa fa-cubes',
					name:'Productos'
				},	
				product_type:product_type
			},req);			
		});
	},
	create : function (req,res){
		var product = req.params.all() || {};
		product.company = req.session.select_company || req.user.select_company;
		product.createUser = req.user.id;
		product.req = req;
		Product_type.findOne({id:product.product_type}).exec(function(err,product_type){
			product.fields = product_type.fields; 
			Product.create(product).exec(function(e,product){
				if(e) res.redirect('/product/');
				else res.redirect('/product/edit/'+product.id);
			});
		});
		return 0;
	},
	edit: function(req,res){
		var id = req.param('id');
		if(id){
			Product.findOne(id).exec(function(err,product){
				//Custom_fields.find({product:product.product_type}).exec(function(err,fields){
				//});
				var select_company = req.session.select_company || req.user.select_company;
				Product_type.find({company:select_company}).exec(function(err,product_types){
					Common.view(res.view,{
						product:product,
						product_types:product_types,
						page:{
							description: product.description || '',
							icon : 'fa fa-cube',
							name : product.name,
						},
						types: Custom_fields.attributes.type.enum,
					},req);			
				});
			});
		
		}else
			res.notFound();
	
	},

	createField: function(req,res){
		var form = req.params.all();
		form = formValidate(form,['name','type','handle','values','product']);
		if(form.values){
			form.values = form.values.split(',');
		}
		var pid = form.product;
		delete form.product;
		Product.findOne(pid).exec(function(e,p){
			if(e) throw(e);
			p.fields[form.handle] = form;
			p.save(function(e,p){
				/*if(e) return res.json({text:'Ocurrio un error.'});
				res.json({text:'Campo agregado.'});	*/
				res.redirect('/product/edit/'+pid);
			})
		});
	},

	update: function(req,res){
		var form = req.params.all()
		, id;
		if(id = form.pid){
			delete form.pid;
			form.req = req;
			Product.update({id:id},form).exec(function(err,product){				
				/*if(err) return res.json({text:'Ocurrio un error.'});
				res.json({text:'Producto actualizado.'});*/
				res.redirect('/product/edit/'+id);
			});
		}else{
			res.json('error');
		}
	},
	/*,indexJson: function(req,res){
		var select_company = req.session.select_company || req.user.select_company;
		Custom_fields.find({company:select_company}).exec(function(err,fields){
			res.json(fields);	
		});
	}

	*/
	productsJson: function(req,res){
		var find = {}
		, form = req.params.all();
		find.company = req.session.select_company || req.user.select_company;
		if(form.type)
			find.sales_type = form.type;
		Product.find(find).exec(function(err,products){
			if(err) return res.json(false);
            _.map(products,function(p){
               p.quantity = 1;//no se otra opcion , tal vez en la vista si no existe el elemento crearlo
            });
            res.json(products);
		});
	},

	productJson: function(req,res){
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
		var select_company = req.session.select_company || req.user.select_company
		Product_type.find({user:req.user.id,company:select_company}).exec(function(err,products){
			if(err) throw err;
				Common.view(res.view,{
					page:{
						description:'AQUI PODRAS VISUALIZAR Y ADMINISRAR TODAS TUS CATEGORIAS'
						,icon:'fa fa-cubes'
						,name:'CATEGORIAS'
					}
					, products:products	
				});

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
		var form = formValidate(req.params.all(),['name','product_type']);
		if(form){
			form.user = req.user.id;
			form.company = req.session.select_company || req.user.select_company;
			Product.create(form).exec(function(err,product){
				if(err) return res.json({text:'Ocurrio un error.'});
				res.json({text:'Producto creado.',url:'/product/edit/'+product.id});
			});	
		}
	}
	
	,productGalleryJson: function(req,res){
		/*var id = req.param('id');
		Product.findOne({id:id}).exec(function(err,product){
			if(err) return res.json(false);
			res.json(product.gallery || []);
		});*/
	}
	,addGallery: function(req,res){
		var form = req.params.all()
		, id
		, dirSave = __dirname+'/../../assets/uploads/gallery/'
		, dirPublic =  __dirname+'/../../.tmp/public/uploads/gallery/'
		, measuresIcon = ["350x150"]//?
		, prefix = "350x150";
		if(id = form.productID){
			Product.findOne({id:id}).exec(function(err,product){
				if(err) return res.json({text:'Ocurrio un error.'});
				var files = req.file && req.file('img')._files || []
				,fileName = new Date().getTime();
				if(files.length){
					var ext = files[0].stream.filename.split('.');
					if(ext.length){
						ext = ext[ext.length-1];
						fileName += '.'+ext;
					}
				}
				req.file('img').upload(dirSave+fileName,function(err,files){
					product.gallery = product.gallery || [];
					product.gallery.push(fileName);
					product.save(function(err){
						if(err) return res.json({text:'Ocurrio un error.'});
						measuresIcon.forEach(function(v){
							var wh = v.split('x')
							, opts = {
								srcPath:dirSave+fileName
								,dstPath:dirSave+v+fileName
								,width:wh[0]
								,height:wh[1]
							}
							im.crop(opts,function(err,stdout,stderr){
								if(err) return res.json({text:'Ocurrio un error.'});
								if(prefix==v){
									fs.createReadStream(dirSave+v+fileName).pipe(fs.createWriteStream(dirPublic+v+fileName))
									.on('finish',function(){
										//return cb && cb(null,"/uploads/gallery/"+prefix+fileName);

										res.json({img:"/uploads/gallery/"+prefix+fileName});
									}).on('error',function(){
										//return cb && cb(true);
										res.json({text:'Ocurrio un error.'});
									});
									
								}
							});
						});
					});
				});
			});
		
		}
	}
	, removeField: function(req,res){
		var fieldID = req.param('fieldID');
		Custom_fields.destroy({id:fieldID}).exec(function(err){
			if(err) return res.json({text:'Ocurrio un error.'});
			res.json({text:'Campo eliminado.'});
		});
	}
	, list: function(req,res){
		var select_company = req.session.select_company || req.user.select_company;
		Product.find({company:select_company,user:req.user.id}).populate("product_type").exec(function(err,products){
			if(err) throw err;
			Common.view(res.view,{
				page:{
					description:'AQUI PODRAS VISUALIZAR Y ADMINISRAR TODOS TUS PRODUCTOS'
					,icon:'fa fa-cubes'
					,name:'PRODUCTOS'
				}
				, products:products
			});
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
