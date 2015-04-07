/**
 * NoticeController
 *
 * @description :: Server-side logic for managing Notices
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	/*
	El propósito de esta función es agregar los atributos del modelo 
	en el que se han hecho los cambios para que la noticia sea más legible y poder traducir los atributos
	*/
	find : function(req,res){
		var params = req.params.all();
		//console.log('find notices');console.log(params);
		delete params.id;
		Notice.find(params).populateAll().exec(function(e,notices){
			for(var x in notices){
				if(sails.models[notices[x].model])
					notices[x].attrs = sails.models[notices[x].model].attrs_labels || {};
			}
			res.json(notices);
		});
	}
};

