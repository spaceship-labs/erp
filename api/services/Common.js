module.exports.view = function(view,data,req){
	data = data || {};
	Companies.find().exec(function(err,comp){
		data.companies = [];
		for(var i=0;i<comp.length;i++){
			var obj = {};
			obj.name = comp[i].name;
			obj.desc = comp[i].description;
			obj.url = '/main/select_company/'+comp[i].id;
			obj.icon = comp[i].icon;
			data.companies.push(obj);
		}
		
		if(req && req.user && !data.page){//iconfa...
			data.page = {};
			Apps.findOne({controller:req.options.controller}).exec(function(err,app){
				data.page = app;
				view(data);	
			});
		}else
			view(data);	
	});	
};
