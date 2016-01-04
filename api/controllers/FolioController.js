/**
 * FolioController
 *
 * @description :: Server-side logic for managing Folios
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index : function(req,res){
		Common.view(res.view,{
			apps : sails.config.apps
			,page:{
				name:'Folios'
				,icon:'fa fa-database'
				,controller : 'folio.js'
			}
		},req);
	}
	,assignment : function(req,res){
		Common.view(res.view,{
			apps : sails.config.apps
			,page:{
				name:'Folios'
				,icon:'fa fa-database'
				,controller : 'folio.js'
			}
		},req);
	}
	,getfolios : function(req,res){
		var params = req.params.all();
		getFolios(params,function(err,folios){
			res.json(folios);
		});
	}
	,getfolio : function(req,res){
		var id = req.params.id;
		getFolio(id,function(err,folio){
			res.json(folio);
		});
	}
};
var getFolios = function(params,callback){
	var limit = params.limit || 25;
	var skip = params.skip || 0;
	delete params.limit;
	delete params.skip;
	Folio.find( params ).limit( limit ).skip( skip ).populateAll().exec(function(err,folios){
		if( err ){ callback(err,false); return; }
		callback(false,folios);
		return;
	});
};
var getFolio = function(id,callback){
	Folio.findOne(id).populateAll().exec(function(err,folio){
		if( err ){ callback(err,false); return; }
		callback(false,folio);
		return;
	});
};