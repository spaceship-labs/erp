/**
 * ZoneController
 *
 * @description :: Server-side logic for managing Zones
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	edit : function(req,res){
		Zone.findOne(req.params.id).populate('location').exec(function(e,zone){
			if(e) return res.redirect("/location/");
			zone = formatZone(zone);
			Common.view(res.view,{
				zone : zone,
				page : {
					name : zone.name_es,
					icon : 'fa fa-flag-o',
					controller : 'zone.js'
				},
				breadcrumb : [
					{label : 'Ciudades', url: '/location/'},
					{label : zone.location.name , url: '/location/edit/' + zone.location.id },
					{label : zone.name_es},
				]
			},req);	
		});
	},
	create : function(req,res){
		var reads = [
			function(cb){
				Zone.create(req.params.all()).exec(cb)
			},function(zone,cb){
				Company.find().exec(function(e,companies_){ cb(e,zone,companies_) })
			},function(zone,companies_,cb){
				Location.find({'location' : req.params.all().location }).populate('zones').exec(function(e,locations_){ cb(e,zone,companies_,locations_) })
			},function(zone,companies_,locations,cb){
				Transfer.find().exec(function(e,transfers){ cb(e,zone,companies_,locations,transfers) })
			},
		];
		async.waterfall(reads,function(e,zone,companies_,locations_,transfers){
			if(e) throw(e);
			var zones1 = [ zone ];
			Transferprices.afterCreateZone(zones1,locations_,transfers,companies_,function(){
				res.json(zone);
			});
		});
	},
	destroy : function(req,res){
		//Borrar los precios que estén relacionados a la zona
		console.log(req.params.all())
		TransferPrice.destroy({ zone1 : req.params.all().id }).exec(function(e,tp){
			TransferPrice.destroy({ zone2 : req.params.all().id }).exec(function(e,tp2){
				Zone.destroy({id:req.params.all().id}).exec(function(e,z){
					if(e) throw(e);
					res.json(z);
				});
			});
		});
	},
	update : function(req,res){
    	var form = req.params.all();
    	var id = form.id;
    	Zone.update({id:id},form,function(e,zone){
    		if(e) throw(e);
    		Zone.findOne(zone[0].id).exec(function(e,zone){
    			if(e) throw(e);
    			res.json(zone);
    		});
    	});
    },
    updateIcon: function(req,res){
    	form = req.params.all();
		Zone.updateAvatar(req,{
			dir : 'zones',
			profile: 'avatar',
			id : form.id,
		},function(e,zone){
			res.json(formatZone(zone));
		});
	},
	addFiles : function(req,res){
		form = req.params.all();
    	Zone.findOne({id:form.id}).exec(function(e,zone){
    		if(e) throw(e);
    		zone.addFiles(req,{
    			dir : 'zones/gallery',
    			profile: 'gallery'
    		},function(e,zone){
    			if(e) throw(e);
    			res.json(formatZone(zone));
    		});
    	});
	},
	removeFiles : function(req,res){
		form = req.params.all();
		Zone.findOne({id:form.id}).exec(function(e,zone){
			zone.removeFiles(req,{
				dir : 'zones/gallery',
				profile : 'gallery',
				files : form.removeFiles,
			},function(e,zone){
				if(e) throw(e);
				res.json(formatZone(zone));
			})
		});
	},
	getZones : function(req,res){
		params = req.params.all();
		console.log(params);
		Zone.find({ 'location' : params.id }).exec(function(e,zones){ 
			if(e) throw(e);
			res.json(zones);
		});
	},
};

function formatZone(zone){
	if(zone){
		zone.avatar = zone.icon ? '/uploads/zones/'+zone.icon : 'http://placehold.it/50x50';
		zone.avatar2 = zone.icon ? '/uploads/zones/177x171'+zone.icon : 'http://placehold.it/177x171';
		return zone;
	}else
		return false;
}