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
	}
};

function formatZone(zone){
	if(zone){
		zone.avatar = zone.icon ? '/uploads/zones/'+zone.icon : 'http://placehold.it/50x50';
		zone.avatar2 = zone.icon ? '/uploads/zones/177x171'+zone.icon : 'http://placehold.it/177x171';
		return zone;
	}else
		return false;
}