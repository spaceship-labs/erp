/**
 * RoomController
 *
 * @description :: Server-side logic for managing rooms
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	edit : function(req,res){
		if(req.params.id){
	    	Room.findOne(req.params.id).populate('hotel').exec(function(e,room){
	    		if(e) throw(e);
    			Season.find({hotel:room.hotel.id}).exec(function(e,seasons){
    				if(e) throw(e);
		    		room = formatRoom(room);
					Common.view(res.view,{
						room:room,
						seasons:seasons,
						_content:sails.config.content,
						page:{
							name : room.name_es,
							icon : 'fa fa-home',
							controller : 'room.js',
						}
					},req);
				});
		   	});
    	}
	},
	updateIcon: function(req,res){
		var form = req.params.all();
		form.req = req;
		Common.updateIcon(req,{
			form:form
			,dirSave : __dirname+'/../../assets/uploads/rooms/'
			,dirPublic:  __dirname+'/../../.tmp/public/uploads/rooms/'
			,Model:Room
			,prefix:'177x171'
			,dirAssets:'/uploads/rooms/'
		},function(e,room){
			if(e) throw(e);
			Room.findOne(form.userId).populate('hotel').exec(function(e,room){
				if(e) throw(e);
				room = formatRoom(room);
				res.json(room)
			});
		});
	},
	update : function(req,res){
    	var form = req.params.all();
    	var id = form.id;
    	form.req = req;
    	delete form.id;
    	delete form.hotel;
    	delete form.createdAt;
    	delete form.updatedAt;
    	delete form.avatar;
    	delete form.avatar2;
    	Room.update({id:id},form,function(e,room){
    		if(e) throw(e);
    		Room.findOne(room[0].id).populate('hotel').exec(function(e,room){
    			if(e) throw(e);
    			room = formatRoom(room);	
    			res.json(room);
    		});
    	});

    },
};
function formatRoom(room){
	if(room){
		room.avatar = room.icon ? '/uploads/rooms/'+room.icon : 'http://placehold.it/50x50';
		room.avatar2 = room.icon ? '/uploads/rooms/177x171'+room.icon : 'http://placehold.it/177x171';
		return room;
	}else
		return false;
}
