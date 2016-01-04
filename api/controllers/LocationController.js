/**
 * LocationController
 *
 * @description :: Server-side logic for managing locations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req,res){
		//Zone.destroy().exec(function(err,zones){
		Location.find().sort('name').populate('zones').exec(function(e,locations){
			Common.view(res.view,{
				locations:locations,
				page:{
					name:req.__('sc_location')
					,icon:'fa fa-flag'		
					,controller : 'location.js'
				},
				breadcrumb : [
					{label : req.__('sc_location')}
				]
			},req);
		});
		//});
	},
	customfind : function(req,res){
		var params = req.params.all();
		var skip = params.skip || 0;
		if( typeof params.id == 'undefined' ) delete params.id;
		delete params.skip;
        if(params.name) params.name = new RegExp(params.name,"i");
        Location.find(params).skip(skip).exec(function(err,ls){
        	if(err) res.json('err');
        	Location.count(params).exec(function(e,count){
        		if(e) res.json('err');
            	res.json({ results : ls , count : count });
        	});
        });
	},
	edit : function(req,res){
		Location.findOne(req.params.id).populate('zones').populate('locations').exec(function(e,location){
			if(e) return res.redirect("/location/");
			Location.find({ id : {'!':location.id} }).exec(function(e,locations){
				//LocationRelated.find({location1 : location.id}).populate('location1').populate('location2').exec(function(e,relatedLocations){
					if(e) return res.redirect("/location/");
					Common.view(res.view,{
						location_o : location,
						locations : locations,
						//relatedLocations : relatedLocations,
						page:{
							name:location.name,
							icon:'fa fa-flag',
							controller : 'location.js'
						},
						breadcrumb : [
							{label : req.__('sc_location'), url: '/location/'},
							{label : location.name},
						]
					},req);	
				//});
			});
		});
	},
	addLoc : function(req,res){
		var form = req.params.all();
    	var id = form.id;
    	var loc = form.loc;
    	//console.log('add form');console.log(form);
    	Location.findOne(id).exec(function(err, location_o) {
    		//if(e) throw(e);
    		location_o.locations.add(loc);
    		location_o.save(function(err){
    			Location.findOne(loc).exec(function(e,loc_o){
    				loc_o.locations.add(id);
    				loc_o.save(function(err){
    					res.json(location_o);
    				});
				});
    		});
    	});
	},
	removeLoc : function(req,res){
		var form = req.params.all();
    	var id = form.id;
    	var loc = form.loc;
    	//console.log('delete form');console.log(form);
    	Location.findOne(id).exec(function(err, location_o) {
    		//if(e) throw(e);
    		location_o.locations.remove(loc);
    		location_o.save(function(err){
    			Location.findOne(loc).exec(function(e,loc_o){
    				loc_o.locations.remove(id);
    				loc_o.save(function(err){
    					res.json(location_o);
    				});
				});
    		});
    	});
	},
	update : function(req,res){
    	var form = req.params.all();
    	var id = form.id;
    	//console.log(form);
    	Location.update({id:id},form,function(e,location_o){
    		//if(e) throw(e);
    		Location.findOne(id).populate('locations').exec(function(e,location_o){
    			if(e) throw(e);
    			res.json(location_o);
    		});
    	});
    },
    addZone : function(req,res){
    	var reads = [
			function(cb){
				Zone.create(req.params.all()).exec(cb)
			},function(zone,cb){
				Company.find().exec(function(e,companies_){ cb(e,zone,companies_) })
			},function(zone,companies_,cb){
				Location.find({'id' : req.params.all().location }).populate('zones').populate('locations').exec(function(e,locations_){ cb(e,zone,companies_,locations_) })
			},function(zone,companies_,locations_,cb){
				Transfer.find().exec(function(e,transfers){ cb(e,zone,companies_,locations_,transfers) })
			},
		];
		async.waterfall(reads,function(e,zone,companies_,locations_,transfers){
			if(e) throw(e);
			var zones1 = [];zones1.push(zone);
			Transferprices.afterCreateZone(zones1,locations_,transfers,companies_,function(){
				res.json(zone);
			});
		});
		/*var form = req.params.all();
		var location_o = form.location;
		Zone.create(form).exec(function(e,r){
			if(e) throw(e);
			Location.findOne(location_o).populate('zones').exec(function(e,location_o){
				if(e) throw(e);
				location_o = location_o;
				res.json(location_o)
			});
		});*/
	},
	updateIcon: function(req,res){
    	form = req.params.all();
		Location.updateAvatar(req,{
			dir : 'locations_o',
			profile: 'avatar',
			id : form.id,
		},function(e,location){
			res.json(location);
		});
	},
	addFiles : function(req,res){
		form = req.params.all();
    	Location.findOne({id:form.id}).exec(function(e,location){
    		if(e) throw(e);
    		location.addFiles(req,{
    			dir : 'locations_o/gallery',
    			profile: 'gallery'
    		},function(e,location){
    			if(e) throw(e);
    			res.json(location);
    		});
    	});
	},
	removeFiles : function(req,res){
		form = req.params.all();
		Location.findOne({id:form.id}).exec(function(e,location){
			location.removeFiles(req,{
				dir : 'locations_o/gallery',
				profile : 'gallery',
				files : form.removeFiles,
			},function(e,location){
				if(e) throw(e);
				res.json(location);
			})
		});
	},
	addrelatelocations : function(req,res){
		var form = req.params.all();
		if( form.relatedLocations && form.location_ ){
			var related = form.relatedLocations;
			var thelocation = form.location_;
			for( x=0;x<related.length;x++){
				var aux = [ {location1:thelocation,location2:related[x].id} , {location1:related[x].id,} ]
			}
		}
	}
};

