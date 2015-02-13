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
		      if(e) return res.redirect("/packagetour/");
		      Common.view(res.view,{
		        item:item,
		        locations : locations, 
		        page:{
		          name : item.package_.name ,
		          icon : 'fa fa-dropbox' ,
		          controller : 'packagetour.js'
		        },
		        breadcrumb : [
		          { label : 'Paquetes', url: '/packagetour/'},
		          { label : item.package_.name , url : '/packagetour/' + item.package_.id },
		          { label : item.name_es }
		        ]
		      },req); 
		    });
	    });
  	},
};

