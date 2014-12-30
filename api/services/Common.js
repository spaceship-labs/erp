module.exports.view = function(view,data,req){
	data = data || {};
	data.page = data.page || {};
	data.breadcrumb = data.breadcrumb || [{label:'Tablero'}];
	data.companies = req.user.companies;
	data.selected_company = req.session.select_company || req.user.select_company;
	data.current_user = req.user;
	data._content = sails.config.content;
	Company.findOne(data.selected_company).populate('base_currency').exec(function(e,company){
        if (e) console.log(e);
		data.selected_company = company;
		view(data);
	});
};

module.exports.renderMenu = function(req){
	var menu = "";
    var selected_company = req.res.locals.selected_company;
    _.each(sails.config.apps,function(app){
        if (_.contains(selected_company.apps,app.name) && req.user.hasAppPermission(selected_company.id,app)) {
            menu += "<li class='dropdown'><a href=''><span class='fa "+app.icon+"'></span>"+app.label+"</a><ul>";
            _.each(app.actions,function(view){
                if (req.user.hasPermission(selected_company.id,view.handle) && view.showInMenu)
                    menu += "<li><a href='"+view.url+"'><span class='fa "+view.icon+"'></span> "+view.label+"</a></li>";
            });
            menu += "</ul></li>";
        }
    });
	return menu;
};

var fs = require('fs')
, im = require('imagemagick');
module.exports.updateIcon = function(req,opts,cb){
	var dirSave = opts.dirSave
	, dirPublic = opts.dirPublic
	, Model = opts.Model
	, form = opts.form
	, prefix = opts.prefix || false
	, dirAssets = opts.dirAssets
	, files = req.file && req.file('icon_input')._files || []
	, fileName = new Date().getTime()
	, measuresIcon = ['593x331','80x80','50x50','184x73','177x171','196x140'];
	if(files.length){
		var ext = files[0].stream.filename.split('.');
		if(ext.length){
			ext = ext[ext.length-1];
			fileName += '.'+ext;
		}
	}
	Model.findOne({id:form.userId}).exec(function(err,user){
		if(err) return cb && cb(err);
		req.file('icon_input').upload(dirSave+fileName,function(err,files){
			if(err) return cb && cb(err);

			var lastIcon = user.icon;
			fs.unlink(dirSave+lastIcon,function(){
				//silence warning if not exists.
			});
			Model.update({id:form.userId},{icon:fileName,req:form.req},function(err,user){
				if(err) return cb && cb(err);
				measuresIcon.forEach(function(v){
					fs.unlink(dirSave+v+lastIcon,function(){
						//silence warning if not exists.
					});
					
					var wh = v.split('x')
					, opts = {
						srcPath:dirSave+fileName
						,dstPath:dirSave+v+fileName
						,width:wh[0]
						,height:wh[1]
					}
					im.crop(opts,function(err,stdout,stderr){
						if(err) return cb && cb(err);
						if(prefix==v){
							fs.createReadStream(dirSave+v+fileName).pipe(fs.createWriteStream(dirPublic+v+fileName))
							.on('finish',function(){
								//return cb && cb(null,dirAssets+prefix+fileName);
								return cb && cb(null,user);
							}).on('error',function(){
								return cb && cb(true);
							});
						
						}
					});
					if(!prefix){
						return cb && cb(null,user);
					}
				});	
			});
		});
	});

};

module.exports.updateInfoProfile = function(req,opts,cb){
	var id = opts.id
	, validate = opts.validate || []
	, Model = opts.Model
	, form = opts.form;

	if(validate.length){
		validate.push('req');
		for(var i in form){
			if(validate.indexOf(i)==-1)
				delete form[i];
		}
	
	}
	if(form.active){
		var active = form.active;
		form.active = form.active==0?false:true;
	}
	Model.update({id:id},form).exec(function(err,m){
		if(m && form.active!=undefined){	
			m = {
				activeN:active==0?1:0
				,active:active==1?'Desactivar':'Activar'
			};
		}
		return cb && cb(err,m);
	});
};

module.exports.editAjax = function(req,res,update){
	var form = req.params.all();
	form.req = req;
	if(form.userId){
		if(form.method in update)
			update[form.method](req,form,function(err,data){
				var data = {
					 status: true
					,msg: 'actualizado'
					,data: data
				};
				if(err){
					data.status = false;
					data.msg = 'Ocurrio un error';
				}
				res.json(data);
			});
	}
	
};

module.exports.formValidate = function(form,validate){
    for(var i in form){
        if(validate.indexOf(i)==-1)
            delete form[i];
    }
    return form;
};

function equals(a,b){
    var typeA = typeof(a)
        ,typeB = typeof(b);
    if((typeA == 'array' && typeB == 'array') || (typeA == 'object' && typeB == 'object' )){

        var p;
        for(p in a) {
            if(typeof(b[p])=='undefined'){
                return false;
            }
        }
    
        for(p in a){
            if(a[p]){
                if(typeof(a[p]) == 'object'){
                    if(!equals(a[p],(b[p]))){
                        return false; 
                    }
                }else{
                    if(a[p] != b[p]){ 
                        return false;
                    }
                }
            }else{
                if (b[p]){
                    return false;
                }
            }
        }
    
        for(p in b){
            if(typeof(a[p])=='undefined'){
                return false;
            }
        } 
        return true;
    }

    return a==b;
}
module.exports.equals = equals;
