module.exports.view = function(view,data){
	data = data || {};
	data.page = data.page || {};
	Companies.find().exec(function(err,comp){
		data.companies = [];
		for(var i=0;i<comp.length;i++){
			var obj = {};
			obj.name = comp[i].name;
			obj.desc = comp[i].description;
			obj.url = '/main/select_companie/'+comp[i].id;
			obj.icon = '/main/select_companie/'+comp[i].icon;
			data.companies.push(obj);
		}
		view(data);	
	});
	
}
