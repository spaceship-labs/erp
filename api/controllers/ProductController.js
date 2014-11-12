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
		Product_type.find().exec(function(err,product_types){
			if(err) throw err;
			Product.find({company:select_company}).populate("product_type").exec(function(err,products){
				if(err) throw err;
				Common.view(res.view,{
					page:{
						description:'AQUI PODRAS VISUALIZAR Y ADMINISRAR TODOS TUS PRODUCTOS'
						,icon:'fa fa-cube'
						,name:'PRODUCTOS'
					}
					, products:products
					, product_types:product_types
				},req);
			});		
		});
	},

	new: function(req,res){
		Product_type.find().exec(function(err,product_type){
			if(err) throw(err);
			Common.view(res.view,{
				page:{
					description:'',
					icon:'fa fa-cube',
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
			Product.create(product).exec(function(e,product){
				if(e) return res.json({text : 'error',message : e});
				else return res.json({text : 'Producto creado exitosamente',url: '/product/edit/'+product.id});
			});
		});
	},
	edit: function(req,res){
		var id = req.param('id');
        var company = req.session.select_company || req.user.select_company;
		if(id){
			Product.findOne({id : id,company : company }).populate('fields').populate('prices').populate('price').exec(function(err,product){
                if (err) throw(err);
				Product_type.find().populate('fields').populate('machines').exec(function(err,product_types){
                    var product_type = {};
                    _.each(product_types,function(item){
                       if (item.id == product.product_type) {
                           product_type = item;
                       }
                    });
					Common.view(res.view,{
						product:product,
						product_types:product_types,
                        product_type : product_type,
						page:{
							description: product.description || '',
							icon : 'fa fa-cube',
							name : product.name
						}
					},req);			
				});
			});
		
		}else
			res.notFound();

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
	productsJson: function(req,res){
		var find = {}
		, form = req.params.all();
		find.company = req.session.select_company || req.user.select_company;
		if(form.type)
			find.sales_type = form.type;
		Product.find(find).exec(function(err,products){
			if(err) return res.json(false);
            _.map(products,function(p){
               p.quantity = 1;//meter este campo nuevo en el find
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
				Sales_type.find({type:{$in:product.sales_type}}).exec(function(err,sales_type){
					product.sales_type = sales_type;
					res.json(product);
				});
			});
			
		});
	}
	,createProduct: function(req,res){
		var form = Common.formValidate(req.params.all(),['name','product_type']);
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
        res.json([]);
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
							};
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
	, list: function(req,res){
		var select_company = req.session.select_company || req.user.select_company;
		Product.find({company:select_company}).populate("product_type").exec(function(err,products){
			if(err) throw err;
			Common.view(res.view,{
				page:{
					description:'AQUI PODRAS VISUALIZAR Y ADMINISRAR TODOS TUS PRODUCTOS'
					,icon:'fa fa-cube'
					,name:'PRODUCTOS'
				}
				, products:products
			});
		});
	},

    updateFields : function(req,res) {
        var form = req.param('fields');
        var product = req.param('product');

        var savedFields = [];
        async.each(form,function(field,callback){
            if (field.id) {
                Custom_fields_value.update({id : field.id},{ value : field.value }).exec(function(err,fieldAux){
                    savedFields.push(field.id);
                    callback();
                });
            } else {
                Custom_fields_value.create({ field : field.field,product : product,value : field.value }).exec(function(err,fieldAux){
                    savedFields.push(fieldAux.id);
                    callback();
                });
            }
        },function(err) {
            if (err) return res.json({text: 'Ocurrio un error.'});
            Product.update({id: product},{fields : savedFields}).exec(function (err, product) {
                if (err) return res.json({text: 'Ocurrio un error.'});
                res.json({text: 'Producto actualizado.'});
            });
        });
    },

    updatePrices : function(req,res) {
        var price = req.param('price');
        var product = req.param('product');

        if (price.id) {
            Product_price.update({id : price.id , product : product},{ cost : price.cost,margin : price.margin }).exec(function(err,pprice){
                if (err) return res.json({text: 'Ocurrio un error.'});
                res.json({text: 'Precio actualizado.'});
            });
        } else {
            price.product = product;
            Product_price.create(price).exec(function(err,pprice){
                Product.update({id : product},{price : pprice.id}).exec(function(err,pproduct){
                    if (err) return res.json({text: 'Ocurrio un error.'});
                    res.json({text: 'Precio actualizado.'});
                });
            });
        }
    },

    updateInventory : function(req,res){
        var inventory = req.param('inventory');
        var product = req.param('product');

        Product.findOne({id : product}).exec(function(err,pproduct) {
            if (err) return res.json({text: 'Ocurrio un error.'});
            if (!pproduct.quantity) {
               pproduct.quantity = 0;
            }
            pproduct.quantity = parseInt(pproduct.quantity) + parseInt(inventory);
            Product.update({id : product},{quantity : 0}).exec(function(err,aux_product){
               if (err) return res.json({text: 'Ocurrio un error.'});
               res.json({text: 'Inventario actualizado.'});
            });
        });
    }
};
