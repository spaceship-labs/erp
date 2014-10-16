/**
 * SeasonController
 *
 * @description :: Server-side logic for managing seasons
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req,res){
		SeasonScheme.find().exec(function(e,schemes){
			if(e) throw(e);
			Common.view(res.view,{
				schemes:schemes,
				page:{
					name:'Esquemas de Temporadas'
					,icon:'fa fa-sun-o'		
					,controller : 'season.js'						
				},
				breadcrumb : [
					{label : 'Temporadas'}
				]
			},req);
		})
		
	},
};

