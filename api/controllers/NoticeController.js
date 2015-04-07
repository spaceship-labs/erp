/**
 * NoticeController
 *
 * @description :: Server-side logic for managing Notices
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	find : function(req,res){
		var params = req.params.all();
		console.log('find notices');
		console.log(params);
		delete params.id;
		Notice.find(params).populateAll().exec(function(e,notices){
			console.log(notices.length);
			for(var x in notices){
				if(sails.models[notices[x].model])
					notices[x].attrs = sails.models[notices[x].model].attrs_labels || {};
			}
			res.json(notices);
		});
	}
};

