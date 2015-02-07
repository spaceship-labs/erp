/**
 * HotelRoomViewController
 *
 * @description :: Server-side logic for managing hotelroomviews
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req,res){
		HotelRoomView.find().sort('name DESC').exec(function(e,hviews){
			if(e) throw(e);
			Common.view(res.view,{
				hviews : hviews,
				page:{
					name:'Vistas de cuartos'
					,description: 'Administracion de contenido de cuartos'
					,icon:'fa fa-eye'
					,controller : 'hotelroomview.js'
				},
				breadcrumb : [
					{label : 'Vistas'}
				]
			},req);
		});
	},
	edit : function(req,res){
		HotelRoomView.findOne(req.params.id).exec(function(e,hview){
			if(e) throw(e);
			Common.view(res.view,{
				hview : hview,
				page:{
					name:'Vista: ' + hview.name
					,description: 'Edición de la vista'
					,icon:'fa fa-eye'
					,controller : 'hotelroomview.js'
				},
				breadcrumb : [
					{label : 'Vistas',url : '/hotelroomview/'},
					{label : hview.name}
				]
			},req);
		})
	},
	update : function(req,res){
		var form = req.params.all();
    	var id = form.id;
    	HotelRoomView.update({id:id},form,function(e,hview){
    		if(e) throw(e);
    		HotelRoomView.findOne(hview[0].id).exec(function(e,hview){
    			if(e) throw(e);
    			res.json(hview);
    		});
    	});
	}
};