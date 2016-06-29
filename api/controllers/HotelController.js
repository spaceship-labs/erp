/**
 * HotelController
 *
 * @description :: Server-side logic for managing hotels
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var moment = require('moment');
var async = require('async');
var fs = require('fs');
module.exports = {
	index : function(req,res){
		//Hotel.find({company: req.session.select_company}).sort('name DESC').limit(5).populate('location').exec(function(e,hotels){
			//if(e) throw(e);
			Location.find().sort('name').exec(function(e,locations){
				if(e) throw(e);
				SeasonScheme.find().sort('name').exec(function(e,schemes){
					if(e) throw(e);
					FoodScheme.find().sort('name').exec(function(e,foodSchemes){
						//hotels = formatHotels(hotels);
						Common.view(res.view,{
							hotels:[],
							locations:locations,
							zones:[],
							schemes : schemes,
							foodSchemes : foodSchemes,
							_content:sails.config.content,
							page:{
								name:req.__('sc_hotels')
								,description: req.__('sc_hotels_desc')
								,icon:'fa fa-building'		
								,controller : 'hotel.js'
							},
							breadcrumb : [
								{label : req.__('sc_hotels')}
							]
						},req);
					});
				});
				
			});
		//});
	},
	setAllHotelsUrl : function(req,res){
		var params = req.params.all();
		Common.setAllHotelsUrl(params.limit,params.skip,function(err,hotels){
			res.json({ err:err, results : hotels?true:false });
		});
	},
	find : function(req,res){
		var params = req.params.all();
		var skip = params.skip || 0;
		var limit = params.limit || 200;
		//console.log(params);
		if( typeof params.id == 'undefined' ) delete params.id;
		delete params.skip;
		delete params.limit;
		delete params.company;
		delete params.adminCompany;
		//params.company = req.session.select_company;
        if(params.name) params.name = new RegExp(params.name,"i");
        Hotel.find(params).skip(skip).limit(limit).populateAll().exec(function(err,hotels){
        	if(err) res.json('err');
        	Hotel.count(params).exec(function(e,count){
        		if(e) res.json('err');
        		hotels = formatHotels(hotels);
            	res.json({ results : hotels , count : count });
        	});
        });
	},
	destroy : function(req,res){
		Hotel.destroy({id:req.params.id}).exec(function(e,r){
			if(e) throw(e);
			res.json(r);
		})
	},
	removeView : function(req,res){
		var params = req.params.all();
		Room.findOne({id:params.obj}).exec(function(e,room){
			if(e) throw(e);
			room.views.remove(params.rel);
			room.save(function(e,room){
				if(e) throw(e);
				res.json(room)
			});
		})
	},
	removeFoodScheme : function(req,res){
		var params = req.params.all();
		Hotel.findOne({id:params.obj}).exec(function(e,hotel){
			if(e) throw(e);
			hotel.foodSchemes.remove(params.rel);
			hotel.save(function(e,hotel){
				if(e) throw(e);
				res.json(hotel)
			});
		});
	},
    edit : function(req,res){
    	if( req.params.id ){
	    	Hotel.findOne(req.params.id).populate('rooms').exec(function(e,hotel){
	    		if(e) throw(e);
	    		hotel = formatHotel(hotel);
	    		Location.find().sort('name').exec(function(e,locations){
	    			SeasonScheme.find().sort('name').exec(function(e,schemes){
	    				var zoneparams = hotel.location ? { 'location' : hotel.location } : {};
	    				//Zone.find(zoneparams).exec(function(e,zones){
	    				Location.findOne(hotel.location).populate('zones').exec(function(e,lZones){ 
	    					lZones = lZones||{};
	    					FoodScheme.find().sort('name').exec(function(e,foodSchemes){
	    						//console.log(hotel.foodSchemes);
	    						//console.log(typeof hotel.foodSchemes.add );
		    					Common.view(res.view,{
									hotel:hotel,
									locations:locations,
									schemes:schemes,
									zones:lZones.zones||[],
									foodSchemes:foodSchemes,
									_content:sails.config.content,
									page:{
										saveButton : true,
										name : hotel.name,
										icon : 'fa fa-building',		
										controller : 'hotel.js',			
									},
									breadcrumb : [
										{label : req.__('sc_hotels'), url : '/hotel/'},
										{label : hotel.name}
									]
								},req);
	    					});
	    				});
					});
				});
		   	});
    	}
    },
	create : function(req,res){
    	var form = req.params.all();
    	if(form){
      		if(form.phones) form.phones = form.phones.split(',');
	      	//form.location = form.location.id;
	      	form.user = req.user.id;
			form.req = req;
	      	form.company = req.session.select_company || req.user.select_company;
	      	Hotel.create(form).exec(function(err,hotel){
	        	if(err) return res.json({text:err});
	        	Hotel.find().populate('location').exec(function(e,hotels){
	        		result = {thehotel : hotel};
	        		res.json(result);
	        	});
	      	});
    	}
  	},
    update : function(req,res){
    	var form = req.params.all();
    	form.req = req;
    	Hotel.update({id:form.id},form,function(e,hotel){
    		if(e) throw(e);
		
    		Hotel.findOne(form.id).populate('rooms').exec(function(e,hotel){
    			if(e) throw(e);    			
    			hotel = formatHotel(hotel);	
    			res.json(hotel);
    		});
    	});

    },
    updateIcon: function(req,res){
    	form = req.params.all();
		Hotel.updateAvatar(req,{
			dir : 'hotels',
			profile: 'avatar',
			id : form.id,
		},function(e,hotel){
			res.json(formatHotel(hotel));
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
    			if(e){
                        return res.json({success:false});
                }
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
		delete form.id;
		var hotel = form.hotel;
		Room.create(form).exec(function(e,r){
			if(e) throw(e);
			Hotel.findOne(hotel).populate('location').populate('rooms').exec(function(e,hotel){
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
			Hotel.findOne(hotel).populate('location').populate('rooms').exec(function(e,hotel){
				if(e) throw(e);
				hotel = formatHotel(hotel);
				res.json(hotel)
			});
		});
	},
	getZones : function(req,res){
		params = req.params.all();
		Zone.find({ 'location' : params.id }).exec(function(e,zones){ 
			if(e) throw(e);
			res.json(zones);
		});
	},
	uploadcvs : function(req,res){
	    var dateValue = new Date();
	    var dirSave = __dirname+'/../../assets/uploads/cvs/';
	    var dateString = 'cvstest';
	    var errors = [];
	    req.file('file').upload({saveAs:dateString + '.csv',dirname:dirSave,maxBytes:52428800},function(e,files){
	        if(e) res.json({text : 'error'});
	        if (files && files[0]){
	            var fileImported = { fileName : files[0].filename, dtStart : dateValue, status : 'processing' };
	            var lineList = fs.readFileSync(dirSave + dateString +".csv").toString().split('\n');
	            lineList.shift();
	            var schemaKeyList = ['mkpid','spaceid'];
	            async.mapSeries(lineList,function(line,callback) {
	                var h = {};
	                //set keys for items in reservations
	                line.split(',').forEach(function (entry, i) { h[schemaKeyList[i]] = entry; });
	                console.log(h['mkpid'],typeof h['mkpid']);
	                Hotel.findOne({mkpid:parseInt(h['mkpid'])}).exec(function(err,found){
	                	if(err||!found){ console.log('no hotel',h['mkpid']); return callback(null,false);}
	                	found.spaceid = 'sp_' + h['spaceid']
	                	found.save(callback);
	                });
	            }, function(err,result) { 
	                if(err){ 
	                	console.log('err: ',err);
	                	res.json({success : false , result : [] , errors : [err] });
	                }
	                res.json({success : true, result : result , errors : [] });
	            }); //async end
	        }else{
	          res.json({success : false , result : [] , errors : [] });
	        }
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
		return date.locale('es').fromNow();
	}
	return date.locale('es').format('LLLL');
}
