/**
 * TemplateController
 *
 * @description :: Server-side logic for managing templates
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	find: function(req,res) {
		var tpl = req.param('id');
		//console.log('looking for template' + tpl);
		require('fs').readFile('assets/templates/partials/'+tpl,function (err, contents) {
		  if (err){
		    console.log(err);
		    res.contentType('text/html');
		    res.send('');
		  }
		  else {
		    res.contentType('text/html');
		    res.send(contents);
		  }	 
		});
	}	
};

