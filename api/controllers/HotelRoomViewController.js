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
					name:req.__('sc_hRoomv')
					,description: req.__('sc_hRoomv_desc')
					,icon:'fa fa-eye'
					,controller : 'hotelroomview.js'
				},
				breadcrumb : [
					{label : req.__('sc_hRoomv')}
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
					name:req.__('sc_hRoomv_')+'Vista: ' + hview.name
					,description: req.__('sc_hRoomv_descedit')
					,icon:'fa fa-eye'
					,controller : 'hotelroomview.js'
				},
				breadcrumb : [
					{label : req.__('sc_hRoomv'),url : '/hotelroomview/'},
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