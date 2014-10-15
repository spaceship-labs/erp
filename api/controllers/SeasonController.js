/**
 * SeasonController
 *
 * @description :: Server-side logic for managing seasons
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req,res){
		SeasonScheme.find().exec(function(e,scheme){
			if(e) throw(e);
			Common.view(res.view,{
				locations:scheme,
				page:{
					name:'Hoteles'
					,icon:'fa fa-building'		
					,controller : 'hotel.js'
						
				},
				breadcrumb : [
					{label : 'Hoteles'}
				]
			},req);
		})
		
	},
};

