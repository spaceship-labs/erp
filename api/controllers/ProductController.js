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
		Product.find({company:select_company,user:req.user.id}).populate("product_type").exec(function(err,products){
			if(err) throw err;
			Common.view(res.view,{
				page:{
					description:'AQUI PODRAS VISUALIZAR Y ADMINISRAR TODOS TUS PRODUCTOS'
					,icon:'fa fa-cubes'
					,name:'PRODUCTOS'
				}
				, products:products
			},req);
		});
	},

	new: function(req,res){
		var select_company = req.session.select_company || req.user.select_company;
		Product_type.find({company:select_company,user:req.user.id}).exec(function(err,product_type){
			if(err) throw(err);
			console.log(product_type);
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
		Product.create(product).exec(function(e,product){
			if(e) res.redirect('/product/');
			else res.redirect('/product/edit/'+product.id);
		});
	},
	edit: function(req,res){
		var id = req.param('id');
		if(id){
			Product.findOne(id).exec(function(err,product){
				//Custom_fields.find({product:product.product_type}).exec(function(err,fields){
				//});
				Common.view(res.view,{
					product:product,
					page:{
						description: product.desctiption || '',
						icon : 'fa fa-cube',
						name : product.name,
					}
				},req);
			});
		
		}else
			res.notFound();
	
	},

	/*,indexJson: function(req,res){
		var select_company = req.session.select_company || req.user.select_company;
		Custom_fields.find({company:select_company}).exec(function(err,fields){
			res.json(fields);	
		});
	}

	
	,productsJson: function(req,res){
		var find = {}
		, form = req.params.all();
		find.company = req.session.select_company || req.user.select_company;
		if(form.type)
			find.sales_type = form.type;
		Product.find(find).exec(function(err,products){
			if(err) return res.json(false);
			res.json(products);
		});
	}*/

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
	,updateProduct: function(req,res){
		var form = req.params.all()
		, id;
		if(id = form.productID){
			delete form.productID;
			delete form.id;
			delete form._;
			Product.update({id:id},form).exec(function(err,product){
				if(err) return res.json({text:'Ocurrio un error.'});
				res.json({text:'Producto actualizado.'});
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

    , productJsonOptional: function(req,res){
        var products = [{ id : 12,name : 'martillo' , price : 12.5,quantity : 1 },
                        { id : 5,name : 'taladro' , price : 180,quantity : 1  },
                        { id : 7,name : 'tornillos' , price :.75,quantity : 1  }];
        res.json(products);
    }
};

function formValidate(form,validate){
	for(var i in form){
		if(validate.indexOf(i)==-1)
			delete form[i];
	}
	return form;
}
