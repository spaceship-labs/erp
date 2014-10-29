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
			Common.view(res.view,{
				tour:tour,
				page:{
					name:tour.name,
					icon:'fa fa-child',
					controller : 'tour.js'
				},
				breadcrumb : [
					{label : 'Tours', url: '/tour/'},
					{label : tour.name},
				]
			},req);	
		})
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
    	Tour.update({id:id},form,function(e,tour){
    		if(e) throw(e);
    		Tour.findOne(tour[0].id).exec(function(e,tour){
    			if(e) throw(e);
    			res.json(tour);
    		});
    	});
    },
};

