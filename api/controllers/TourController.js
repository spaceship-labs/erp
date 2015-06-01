/**
 * TourController
 *
 * @description :: Server-side logic for managing tours
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index: function(req,res){
		Tour.find({}).sort('name').exec(function(e,tours){
			SeasonScheme.find().sort('name').exec(function(e,schemes){
				Location.find({}).sort('name').exec(function(e,locations){ TourProvider.find().exec(function(e,providers){
					Common.view(res.view,{
						tours:tours,
						schemes:schemes,
						locations:locations,
						providers : providers,
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
			});
		});
	},
	find : function(req,res){
		var params = req.params.all();
		var skip = params.skip || 0;
		delete params.id;
		delete params.skip;
        if(params.name) params.name = new RegExp(params.name,"i");
        Tour.find(params).skip(skip).exec(function(err,tours){
        	if(err) res.json('err');
        	Tour.count(params).exec(function(e,count){
        		if(e) res.json('err');
            	res.json({ results : tours , count : count });
        	});
        });
	}
	,create : function(req,res){
		var form = req.params.all();
		form.days = [true,true,true,true,true,true,true];
		form.name_pt = form.name_es = form.name_en = form.name_ru = form.name;
		form.req = req;
		form.fee_base = form.fee || 0;
		form.feeChild_base = form.feeChild || 0;
		Tour.create(form).exec(function(err,tour){
			if(err) return res.json({text:err});
			Tour.find({}).sort('name').exec(function(e,tours){
				if(e) return res.json({text:e});
				var result = { tours : tours , thetour : tour }
				res.json(result);
			});
		});
	},
	edit : function(req,res){
		Tour.findOne(req.params.id).exec(function(e,tour){
			if(e) return res.redirect("/tour/");
			Location.find({}).sort('name').exec(function(e,locations){
	    		SeasonScheme.find().sort('name').exec(function(e,schemes){ TourProvider.find().exec(function(e,providers){
	    			if(tour.provider)
	    				tour.provider = tour.provider.id || tour.provider;
					Common.view(res.view,{
						tour:tour,
						locations:locations,
						schemes:schemes,
						providers : providers,
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
				}); });
			});
		});
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
	update : function(req,res){
    	var form = req.params.all();
    	var id = form.id;
		form.req = req;
    	if(form.days){
    		var new_days = [];
    		form.days.forEach(function(day){
    			new_days.push(day == 'true');
    		});
    		form.days = new_days;
    	}
    	Tour.update({id:id},form,function(e,tour){
    		if(e) throw(e);
    		Tour.findOne(tour[0].id).exec(function(e,tour){
    			if(e) throw(e);
    			res.json(tour);
    		});
    	});
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
};

