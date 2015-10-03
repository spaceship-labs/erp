/**
 * UnityTypeController
 *
 * @description :: Server-side logic for managing unitytypes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req,res){
		UnityType.find().sort('name DESC').exec(function(e,unities){
			if(e) throw(e);
			Common.view(res.view,{
				unities : unities,
				page:{
					name: 'Tipos de unidades'
					,description: ''
					,icon:'fa fa-th-list'
					,controller : 'unity.js'
				},
				breadcrumb : [
					{label : 'Tipos de unidades' }
				]
			},req);
		});
	},
  edit : function(req,res){
    UnityType.findOne(req.params.id).exec(function(e,unity){
      if(e) throw(e);
      Common.view(res.view,{
        unity : unity,
        page:{
          name: 'Tipos de unidades'+': ' + unity.name
          ,description: ''
          ,icon:'fa fa-th-list'
          ,controller : 'unity.js'
        },
        breadcrumb : [
          {label : 'Tipos de unidades',url : '/unititype/'},
          {label : unity.name}
        ]
      },req);
    })
  },
	update : function(req,res){
		var form = req.params.all();
    	var id = form.id;
    	UnityType.update({id:id},form,function(e,unity){
    		if(e) throw(e);
    		UnityType.findOne(unity[0].id).exec(function(e,unity){
    			if(e) throw(e);
    			res.json(unity);
    		});
    	});
	}
};

