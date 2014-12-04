/**
 * TourController
 *
 * @description :: Server-side logic for managing tours
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index: function(req,res){
		Tour.find({}).sort('name').exec(function(e,tours){
			Location.find({}).sort('name').exec(function(e,locations){
				Common.view(res.view,{
					tours:tours,
					locations:locations,
					page:{
						name:'Tours',
						icon:'fa fa-compass',
						controller : 'tour.js'
					},
					breadcrumb : [
						{label : 'Tours'}
					]
				},req);	
			});
		});
	},
	create : function(req,res){
		var form = req.params.all();
		form.days = [true,true,true,true,true,true,true];
		form.name_pt = form.name_es = form.name_en = form.name_ru = form.name;
		Tour.create(form).exec(function(err,tour){
			if(err) return res.json({text:err});
			Tour.find({}).sort('name').exec(function(e,tours){
				if(e) return res.json({text:e});
				res.json(tours);
			});
		});
	},
	edit : function(req,res){
		Tour.findOne(req.params.id).exec(function(e,tour){
			if(e) return res.redirect("/tour/");
			Location.find({}).sort('name').exec(function(e,locations){
				Common.view(res.view,{
					tour:tour,
					locations:locations,
					page:{
						saveButton : true,
						name:tour.name,
						icon:'fa fa-compass',
						controller : 'tour.js'
					},
					breadcrumb : [
						{label : 'Tours', url: '/tour/'},
						{label : tour.name},
					]
				},req);	
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
};

