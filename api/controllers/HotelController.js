/**
 * HotelController
 *
 * @description :: Server-side logic for managing hotels
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var moment = require('moment');
module.exports = {
	index : function(req,res){
		Hotel.find().sort('name').populate('location').exec(function(e,hotels){
			Location.find().sort('name').exec(function(e,locations){
				hotels = formatHotels(hotels);
				Common.view(res.view,{
					hotels:hotels,
					locations:locations,
					page:{
						name:'Hoteles'
						,icon:'fa fa-building'		
						,controller : 'hotel.js'		
					}
				},req);
			});
		});
		
	},	
    edit : function(req,res){
    	if(req.params.id){
	    	Hotel.findOne(req.params.id).populate('location').populate('rooms').populate('seasons').exec(function(e,hotel){
	    		if(e) throw(e);
	    		hotel = formatHotel(hotel);
	    		Location.find().sort('name').exec(function(e,locations){
					Common.view(res.view,{
						hotel:hotel,
						locations:locations,
						_content:sails.config.content,
						page:{
							name : hotel.name,
							icon : 'fa fa-building',		
							controller : 'hotel.js',		
						}
					},req);
				});
		   	});
    	}
    },
	create : function(req,res){
        //var form = Common.formValidate(req.params.all(),['name','address','phones','location']);
        var form = req.params.all();
        if(form){
	        if(form.phones) form.phones = form.phones.split(',');
            form.location = JSON.parse(form.location);
	        form.location = form.location.id;
           	form.user = req.user.id;
			form.req = req;
            form.company = req.session.select_company || req.user.select_company;
            Hotel.create(form).exec(function(err,hotel){
                if(err) return res.json({text:err});
                Hotel.find().populate('location').exec(function(e,hotels){
                	hotels = formatHotels(hotels);
                	res.json(hotels);
                })                
            });
        }
    },
    update : function(req,res){
    	var form = req.params.all();
    	var location = JSON.parse(form.location);
    	var id = form.id;
    	delete form.id;
    	delete form.avatar;
    	delete form.avatar2;
    	delete form.company;
    	delete form.createdAt;
    	delete form.createdAtString;
    	delete form.updatedAt;
    	delete form.updatedAtString;
    	delete form.icon;
    	delete form.user;
    	delete form.rooms;
    	delete form.seasons;
    	delete form.files;
    	form.location = location.id;
    	//console.log(form);
    	form.req = req;
    	Hotel.update({id:id},form,function(e,hotel){
    		if(e) throw(e);
    		Hotel.findOne(hotel[0].id).populate('location').populate('rooms').populate('seasons').exec(function(e,hotel){
    			if(e) throw(e);    			
    			hotel = formatHotel(hotel);	
    			res.json(hotel);
    		});
    	});

    },
    updateIcon: function(req,res){
    	form = req.params.all();
    	Hotel.findOne({id:form.id}).exec(function(e,hotel){
    		if(e) throw(e);
    		hotel.updateAvatar(req,{
    			dir : 'hotels',
    			profile: 'avatar'
    		},function(e,hotel){
    			res.json(formatHotel(hotel));
    		});
    	});
	},
	addFiles : function(req,res){
		form = req.params.all();
    	Hotel.findOne({id:form.id}).exec(function(e,hotel){
    		if(e) throw(e);
    		hotel.addFiles(req,{
    			dir : 'hotels/gallery',
    			profile: 'gallery'
    		},function(e,hotel){
    			if(e) throw(e);
    			res.json(formatHotel(hotel));
    		});
    	});
	},
	removeFiles : function(req,res){
		form = req.params.all();
		Hotel.findOne({id:form.id}).exec(function(e,hotel){
			hotel.removeFiles(req,{
				dir : 'hotels/gallery',
				profile : 'gallery',
				files : form.removeFiles,
			},function(e,hotel){
				if(e) throw(e);
				res.json(formatHotel(hotel));
			})
		});
	},
	addRoom : function(req,res){
		var form = req.params.all();
		var hotel = form.hotel;
		Room.create(form).exec(function(e,r){
			if(e) throw(e);
			Hotel.findOne(hotel).populate('location').populate('rooms').populate('seasons').exec(function(e,hotel){
				if(e) throw(e);
				hotel = formatHotel(hotel);
				res.json(hotel)
			});
		});
	},
	addSeason : function(req,res){
		var form = req.params.all();
		var hotel = form.hotel;
		Season.create(form).exec(function(e,r){
			if(e) throw(e);
			Hotel.findOne(hotel).populate('location').populate('rooms').populate('seasons').exec(function(e,hotel){
				if(e) throw(e);
				hotel = formatHotel(hotel);
				res.json(hotel)
			});
		});
	}
};


function formatHotels(hotels){
	for(var i=0;i<hotels.length;i++) hotels[i] = formatHotel(hotels[i]);
	return hotels;
}
function formatHotel(hotel){
	if(hotel){
		hotel.createdAtString = timeFormat(hotel.createdAt);
		hotel.updatedAtString = timeFormat(hotel.updatedAt);
		hotel.avatar = hotel.icon ? '/uploads/hotels/'+hotel.icon : 'http://placehold.it/50x50';
		hotel.avatar2 = hotel.icon ? '/uploads/hotels/177x171'+hotel.icon : 'http://placehold.it/177x171';
		return hotel;
	}else
		return false;
}

function timeFormat(date){
	date = moment(date);
	var now = moment();
	if(now.diff(date,'days',true)<1){
		return date.lang('es').fromNow();
	}
	return date.lang('es').format('LLLL');
}