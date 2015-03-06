/**
 * ReservationController
 *
 * @description :: Server-side logic for managing Reservations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var async = require('async');
module.exports = {
  index: function (req, res) {
    //return res.json({});
  },
  statsCategories : function(req,res){
  	var asyncTasks = [];
  	var transfersReservations = [];
  	var hotelsReservations = [];
  	var transfersReservations = [];

  	asyncTasks.push(function(cb){
		Reservation.find({reservation_type:'tour'}).populate('order').exec(function(error, toursR) {
			toursReservations = toursR;
			cb();
		});
	}); 

  	asyncTasks.push(function(cb){
		Reservation.find({reservation_type:'hotel'}).populate('order').exec(function(error, hotelsR) {
			hotelsReservations = hotelsR;
			cb();
		});
	}); 

  	asyncTasks.push(function(cb){
		Reservation.find({reservation_type:'transfer'}).populate('order').exec(function(error, transfersR) {
			transfersReservations = transfersR;
			cb();
		});
	}); 	

    async.parallel(asyncTasks,function(){
        var response = {
        	toursReservations : toursReservations,
        	hotelsReservations : hotelsReservations,
        	transfersReservations : transfersReservations,
        };
        res.json(response);
    });

  },
};

