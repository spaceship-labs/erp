/**
 * CuponController
 *
 * @description :: Server-side logic for managing cupons
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	


  /**
   * `CuponController.index()`
   */
  index: function (req, res) {
  	Cupon.find().exec(function(e,cupons){
		Hotel.find().sort('name').exec(function(err,hotels){
	  		Common.view(res.view,{
				cupons:cupons,
				hotels:hotels,
				page:{
					name:'Cupons'
					,icon:'fa fa-ticket'		
					,controller : 'cupon.js'
				},
				breadcrumb : [
					{ label : 'Cupones' }
				]
			},req);		
		});
  	});
  }
  ,edit:function(req,res){
  	Cupon.findOne({id:req.param('id')}).populateAll().exec(function(e,cupon){
		if(e || !cupon) res.notFound()
		Hotel.find().sort('name').exec(function(err,hotels){
	  		Common.view(res.view,{
				cupon:cupon,
				hotels:hotels,
				page:{
					name:cupon.name
					,icon:'fa fa-ticket'		
					,controller : 'cupon.js'
				},
				breadcrumb : [
					{ label : 'Cupones' }
				]
			},req);
			
		});
  	});
  },
  removeHotel : function(req,res){
	var params = req.params.all();
	console.log(params);
	Cupon.findOne({id:params.obj}).exec(function(e,cupon){
		if(e) throw(e);
		cupon.hotels.remove(params.rel);
		cupon.save(function(e,hotel){
			if(e) throw(e);
			res.json(hotel)
		});
	});
  },
  
};

