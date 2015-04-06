/**
 * PackageItemController
 *
 * @description :: Server-side logic for managing Packageitems
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	edit : function(req,res){
	    PackageItem.findOne(req.params.id).populate('package_').exec(function(e,item){
	    	Location.find().sort('name').exec(function(e,locations){
		    	Location.findOne(item.location).exec(function(e,location_){
			      if(e) return res.redirect("/packagetour/");
			      Common.view(res.view,{
			        item:item,
			        locations : locations, 
			        location_ : location_,
			        page:{
			          name : item.package_.name ,
			          icon : 'fa fa-dropbox' ,
			          controller : 'packagetour.js'
			        },
			        breadcrumb : [
			          { label : req.__('sc_packages'), url: '/packagetour/'},
			          { label : item.package_.name , url : '/packagetour/edit/' + item.package_.id },
			          { label : item.name_es }
			        ]
			      },req); 
			    });
		    });
	    });
  	},
  	update : function(req,res){
    	var form = req.params.all();
    	PackageItem.update({id:form.id},form,function(e,p){
    		if(e) throw(e);
    		PackageItem.findOne(p.id).populate('location').populate('package_').exec(function(e,item){
    			if(e) throw(e);
    			res.json(item);
    		});
    	});
  	}
};

