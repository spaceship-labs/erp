/**
 * TourController
 *
 * @description :: Server-side logic for managing tours
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index: function(req,res){
		Tour.find({}).sort('name').populate('provider').exec(function(e,tours){
			SeasonScheme.find().sort('name').exec(function(e,schemes){ TourCategory.find().exec(function(e,tourcategories){
				Location.find({}).sort('name').exec(function(e,locations){ TourProvider.find().exec(function(e,providers){
					Common.view(res.view,{
						tours:tours,
						schemes:schemes,
						locations:locations,
						providers : providers,
						tourcategories: tourcategories,
						page:{
							name:req.__('sc_tour'),
							icon:'fa fa-compass',
							controller : 'tour.js'
						},
						breadcrumb : [
							{label : req.__('sc_tour')}
						]
					},req);	
				}); });
			}); }); //seasons
		});
	},
	find : function(req,res){
		var params = req.params.all();
		var skip = params.skip || 0;
		var limit = params.limit || 200;
		if( typeof params.id == 'undefined' ) delete params.id;
		delete params.skip;
		delete params.limit;
		delete params.company;
		delete params.adminCompany;
        if( params.providerCode ){
        	var par = { mkpid : new RegExp(params.providerCode,"i")};
        	TourProvider.findOne(par).populate('tours').exec(function(err,provider){
        		if( err ){ res.json(err); return; }
    			if(provider)
    				for( var x in provider.tours )
    					provider.tours[x].provider = { name : provider.name };
        		res.json({ results : provider?provider.tours:[] , count : provider?provider.tours.length:0 });
        	});
        }else{
        	if(params.name) params.name = new RegExp(params.name,"i");
	        if( params.provider == 'null' ){ 
	        	delete params.provider; 
	        	params.$or = [ { 'provider' : null } , { 'provider' : ' ' } ];
	    	}
	        Tour.find(params).skip(skip).limit(limit).populate('provider').sort('updatedAt DESC').exec(function(err,tours){
	        	if(err) res.json('err');
	        	Tour.count(params).exec(function(e,count){
	        		if(e) res.json('err');
	            	res.json({ results : tours , count : count });
	        	});
	        });
        }
	}
	,findProducts : function(req,res){
		var params = req.params.all();
		//console.log(params);
		var skip = params.skip || 0;
		var limit = params.limit || 200;
		delete params.skip;
		delete params.limit;
		var company = params.company?params.company:(req.session.select_company.id || req.user.select_company.id);
		delete params.company;
		var adminCompany = params.adminCompany || 'false';
		delete params.adminCompany;
		if( typeof params.id == 'undefined' ) delete params.id;
        if(params.name) params.name = new RegExp(params.name,"i");
        /*if(params.notProvider){
        	params.provider = { '!' : params.notProvider };
        	delete params.notProvider;
        }*/
        Tour.find(params).populate('provider').exec(function(err,tours){
        	if(err) res.json('err');
        	if(adminCompany=='false'){
        		var ids = [];
	        	for(x in tours) ids.push( tours[x].id );
	        	CompanyProduct.find({
	        		product_type : 'tour'
	        		,agency : company
	        		,tour : ids
	        	}).skip(skip).limit(limit).populate('tour').exec(function(cp_err,cproducts){
	        		if(cp_err) res.json('err');
	        		var results = [];
	        		for(var x in cproducts) results.push(cproducts[x].tour);
	        		CompanyProduct.count({product_type : 'tour',agency : company,tour : ids}).exec(function(cp_err,count){
	        			res.json({ results : results , count : count });
	        		});
	        	});
        	}else{
        		Tour.count(params).exec(function(e,count){
	        		if(e) res.json('err');
	            	res.json({ results : tours , count : count });
	        	});
        	}
        });
	}
	,create : function(req,res){
		var form = req.params.all();
		var cats = form.categories || [];
		form.days = [true,true,true,true,true,true,true];
		form.name_pt = form.name_es = form.name_en = form.name_ru = form.name;
		form.req = req;
		form.fee_base = parseFloat(form.fee) || 0;
		form.feeChild_base = parseFloat(form.feeChild) || 0;
		delete form.id;
		delete form.categories;
		Tour.create(form).exec(function(err,tour){ Tour.findOne(tour.id).exec(function(e,tour){
			if(err) return res.json({text:err});
			//console.log(cats);
			for( x in cats ) tour.categories.add( cats[x].id );
			tour.save(function(tour_){
				Tour.find({}).sort('name').exec(function(e,tours){
					if(e) return res.json({text:e});
					var result = { tours : tours , thetour : tour };
					res.json(result);
				});
			});
		}); }); // create and findOne
	},
	edit : function(req,res){
		Tour.findOne(req.params.id).populate('categories',{type:{$ne:'rate'}}).exec(function(e,tour){ TourCategory.find({type:{ $ne:'rate' }}).exec(function(tc_err,tourcategories){
			if(e) return res.redirect("/tour/");
			Location.find({}).sort('name').exec(function(e,locations){
	    		SeasonScheme.find().sort('name').exec(function(e,schemes){ TourProvider.find().exec(function(e,providers){
	    			if(tour.provider)
	    				tour.provider = tour.provider.id || tour.provider;
	    			//for(var x in tour.categories) tour.categories[x] = Common.getItemById(tour.categories[x].id,tourcategories);
					Common.view(res.view,{
						tour:tour,
						locations:locations,
						schemes:schemes,
						providers : providers,
						tourcategories : tourcategories,
						page:{
							saveButton : true,
							name:tour.name,
							icon:'fa fa-compass',
							controller : 'tour.js'
						},
						breadcrumb : [
							{label : req.__('sc_tour'), url: '/tour/'},
							{label : tour.name},
						]
					},req);				
				}); });//seasons and providers
			});//location
		}); }); //tour and tour category
	},
	updateIcon: function(req,res){
    	form = req.params.all();
		Tour.updateAvatar(req,{
			dir : 'tours',
			profile: 'avatar',
			id : form.id,
		},function(e,tour){
			if(e) console.log(e);
			res.json(tour);
		});
	},
	getrates : function(req,res){
		var params = req.params.all();
		if( !params.tour ){ res.json([]); return; }
		TourTourcategory.find({ tour_categories : params.tour }).populate('tourcategory_tours').exec(function(err,cats){
			if( err ){ res.json([]); return; }
			var results = [];
			for( var x in cats ){
				if( cats[x].tourcategory_tours.type && cats[x].tourcategory_tours.type == 'rate' )
				results.push({ category : cats[x].tourcategory_tours , value : cats[x].value, titles : _.pluck(cats[x].tourcategory_tours.rating,'label') })
			}
			res.json(results);
		});
	},
	update : function(req,res){
    	var form = req.params.all();
    	var id = form.id;
		form.req = req;
		//form.fee_base = form.fee_base?form.fee_base:(parseFloat(form.fee) || 0);
		//form.feeChild_base = form.feeChild_base?form.feeChild_base:(parseFloat(form.feeChild) || 0);
    	if(form.days){
    		var new_days = [];
    		form.days.forEach(function(day){
    			new_days.push(day);
    		});
    		form.days = new_days;
    	}
    	var rates = form.rates;
    	var cats = form.categories;
    	delete form.rates;
    	delete form.categories
    	Tour.update({id:id},form,function(e,tour){ Tour.findOne(id).exec(function(e,tour){
    		if(e) throw(e);
    		if( rates ){
    			for( x in rates ) tour.categories.add( rates[x].category.id );
    			for( x in cats ) tour.categories.add( cats[x].id );
    			tour.save(function(tour_){
    				//ahora se van a actualizar los valores con un foreach async
    				async.mapSeries( rates, function(item,theCB){
    					if(item.category.type && item.category.type=='rate'){
    						var aux = { value : item.value };
    						var params = { tourcategory_tours : item.category.id, tour_categories : tour.id };
    						TourTourcategory.update(params,aux,function(err,category){
    							if(err) theCB(err,item);
    							if( category[0] )
    								item.id = category[0].id;
    							theCB(err,item);
    						});
    					}else{
    						theCB(false,item);
    					}
    				},function(err,results){
    					Tour.findOne(id).populate('categories',{type:{$ne:'rate'}}).exec(function(e,tour){
    						tour.rates = results;
							res.json(tour);
    					});
					});
    			});
    		}else{
    			for( x in cats ) tour.categories.add( cats[x].id );
    			tour.save(function(tour_){
	    			Tour.findOne(id).populate('categories').exec(function(e,tour){
		    			if(e) throw(e);
		    			res.json(tour);
		    		});
	    		});
    		}
    	}); });
    },
    removeCategory : function(req,res){
		var params = req.params.all();
		Tour.findOne({id:params.obj}).exec(function(e,tour){
			if(e) throw(e);
			tour.categories.remove(params.rel);
			tour.save(function(e,tour){
				if(e) throw(e);
				res.json(tour)
			});
		})
	},
	addFiles : function(req,res){
		form = req.params.all();
    	Tour.findOne({id:form.id}).exec(function(e,tour){
    		if(e) throw(e);
    		tour.addFiles(req,{
    			dir : 'tours/gallery',
    			profile: 'gallery'
    		},function(e,tour){
    			if(e) throw(e);
    			res.json(tour);
    		});
    	});
	},
	removeFiles : function(req,res){
		form = req.params.all();
		Tour.findOne({id:form.id}).exec(function(e,tour){
			tour.removeFiles(req,{
				dir : 'tours/gallery',
				profile : 'gallery',
				files : form.removeFiles,
			},function(e,tour){
				if(e) throw(e);
				res.json(tour);
			})
		});
	},
	destroy : function(req,res){
		Tour.destroy({id:req.params.id}).exec(function(e,r){
			if(e) throw(e);
			res.json(r);
		})
	},
	formatTimes : function(req,res){
		Tour.find().exec(function(err,tours){
			if(err) res.json(false);
			formatDuration(tours,function(err,result){
				res.json({ err : err , result : result });
			});
		})
	}
};

var formatDuration = function(tours,thecb){
	async.mapSeries( tours, function(tour,cb) {
		//duration_formated
		//duration
		var timeString = tour.duration;
		timeString = timeString.split(' ');
		if( timeString[0] && timeString[0] != '' ){
			var hrs = 0;
			var mins = 0;
			if( timeString[1] && timeString[1] == 'minutos' ){
				mins = !isNaN( parseInt(timeString[0]) )?parseInt(timeString[0]):0; 
			}else{
				timeString = timeString[0].split('.');
				hrs = !isNaN( parseInt(timeString[0]) )?parseInt(timeString[0]):0;
				mins = timeString[1]?parseInt(timeString[1])*6:0;
			}
			var aux = new Date();
			aux.setHours(hrs,mins);
			console.log( tour.id + ' ' + hrs  + ':' + mins );
			console.log( aux );	
			Tour.update({id:tour.id},{ duration_formated : aux }).exec(function(err,t){
				cb(err,t);
			});
		}else
			cb(false,tour);
	},function(err,results){
		thecb(err,results);
	});
}