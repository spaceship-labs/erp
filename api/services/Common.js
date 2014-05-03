var companies = [];
module.exports.view = function(view,data){
	data = data || {};
	if(companies.length){
		data.companies = companies;
		view(data);	
	}else{
		Companies.find().exec(function(err,comp){
			for(var i=0;i<comp.length;i++){
				var obj = {};
				obj.name = comp[i].name;
				obj.desc = comp[i].description;
				obj.url = '/main/select_companie/'+comp[i].id;
				obj.icon = '/main/select_companie/'+comp[i].icon;
				companies.push(obj);
			}
			data.companies = companies;
			view(data);	
		});
	}
}
