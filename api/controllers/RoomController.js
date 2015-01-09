/**
 * RoomController
 *
 * @description :: Server-side logic for managing rooms
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

async = require('async');
module.exports = {
	edit : function(req,res){
		var reads = [
			function(cb){Room.findOne(req.params.id).populate('hotel').exec(cb)},
			function(room,cb){Hotel.findOne(room.hotel.id).populate('seasonScheme').exec(function(e,hotel){cb(e,room,hotel)})},
			function(room,hotel,cb){HotelRoomView.find({}).exec(function(e,views){cb(e,room,hotel,views)})},
			function(room,hotel,views,cb){
				if(hotel.seasonScheme){
					SeasonScheme.findOne(hotel.seasonScheme.id).populate('seasons').exec(function(e,scheme){
						cb(e,room,hotel,scheme,views)
					});
				}else{
					cb(null,room,hotel,false,views);
				}
			},
		];

		async.waterfall(reads,function(e,room,hotel,scheme,views){
			//if(e) throw(e);
            //console.log(room);
            Common.view(res.view,{
				room:room,
				hotel : hotel,
				scheme:scheme,
				views:views,
				_content:sails.config.content,
				page:{
					saveButton : true,
					name : room.name_es,
					icon : 'fa fa-home',
					controller : 'room.js',
				},
				breadcrumb : [
					{label : 'Hoteles', url : '/hotel/'},
					{label : hotel.name, url : '/hotel/edit/'+hotel.id},
					{label : room.name_es}
				]
			},req);
		});
	},
	/*updateIcon: function(req,res){
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
	},*/
	update : function(req,res){
    	var form = req.params.all();
    	var id = form.id;
    	form.req = req;
    	Room.update({id:id},form,function(e,room){
    		if(e) throw(e);
    		Room.findOne(room[0].id).populate('hotel').exec(function(e,room){
    			if(e) throw(e);
    			res.json(room);
    		});
    	});

    },
    addFiles : function(req,res){
		form = req.params.all();
    	Room.findOne({id:form.id}).exec(function(e,room){
    		if(e) throw(e);
    		room.addFiles(req,{
    			dir : 'rooms/gallery',
    			profile: 'gallery'
    		},function(e,room){
    			if(e) throw(e);
    			res.json(room);
    		});
    	});
	},
	removeFiles : function(req,res){
		form = req.params.all();
		Room.findOne({id:form.id}).exec(function(e,room){
			room.removeFiles(req,{
				dir : 'rooms/gallery',
				profile : 'gallery',
				files : form.removeFiles,
			},function(e,room){
				if(e) throw(e);
				res.json(room);
			})
		});
	},
    updateIcon: function(req,res){
    	var form = req.params.all();
		Room.updateAvatar(req,{
			dir : 'rooms',
			profile: 'avatar',
			id : form.id,
		},function(e,room){
			if(e) console.log(e);
			res.json(room);
		});
	}
};