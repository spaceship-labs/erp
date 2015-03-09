/**
* ReservationController
*
* @description :: Server-side logic for managing Reservations
* @help        :: See http://links.sailsjs.org/docs/controllers
*/
var async = require('async');
var moment = require('moment');
module.exports = {
    index: function (req, res) {
        //return res.json({});
    },
    statsCategoriesInDay : function(req,res){
        var asyncTasks = [];
        var toursReservations = [];
        var hotelsReservations = [];
        var transfersReservations = [];
        var params = req.params.all();
        var day, start, end;
        if(params.day){
            day = new Date(params.day);
            start = moment(day).startOf("day").toDate();
            end = moment(day).endOf("day").toDate();

            asyncTasks.push(function(cb){
                Reservation.count({
                    reservation_type:'tour', createdAt: { '>': start, '<': end } 
                }).exec(function(error, toursR) {
                    toursReservations = toursR;
                    cb();
                });
            }); 

            asyncTasks.push(function(cb){
                Reservation.count({
                    reservation_type:'hotel', createdAt: { '>': start, '<': end }
                }).exec(function(error, hotelsR) {
                    hotelsReservations = hotelsR;
                    cb();
                });
            }); 

            asyncTasks.push(function(cb){
                Reservation.count({
                    reservation_type:'transfer', createdAt: { '>': start, '<': end }
                }).exec(function(error, transfersR) {
                    transfersReservations = transfersR;
                    cb();
                });
            });     

            async.parallel(asyncTasks,function(){
                var response = [
                    toursReservations,
                    hotelsReservations,
                    transfersReservations,
                ];
                res.json(response);
            });
        }
    },
    statsCategoriesInMonth : function(req,res){
        var asyncTasks = [];
        var toursReservations = [];
        var hotelsReservations = [];
        var transfersReservations = [];
        var params = req.params.all();
        var start, end;
        //console.log(params.start);
        if(params.start && params.end){
            start = new Date(params.start);
            end = new Date(params.end);

            asyncTasks.push(function(cb){
                Reservation.find({
                reservation_type:'tour', createdAt: { '>': start, '<': end }
                }).populate('order').exec(function(error, toursR) {
                    toursReservations = toursR;
                    cb();
                });
            }); 

            asyncTasks.push(function(cb){
                Reservation.find({
                reservation_type:'hotel', createdAt: { '>': start, '<': end }
                }).populate('order').exec(function(error, hotelsR) {
                    hotelsReservations = hotelsR;
                    cb();
                });
            }); 

            asyncTasks.push(function(cb){
                Reservation.find({
                reservation_type:'transfer', createdAt: { '>': start, '<': end }
                }).populate('order').exec(function(error, transfersR) {
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
        }
    },
    statsCategoriesInYear: function(req,res){
        var asyncTasks = [];
        var toursReservations = [];
        var hotelsReservations = [];
        var transfersReservations = [];
        
        var months = [0,1,2,3,4,5,6,7,8,9,10,11];
        var params = req.params.all();
        var start, end, yearDate;
        var response = {};

        var year = params.year || 2015;
        async.eachSeries(months, function(month, callback) {
            yearDate = new Date(year,month);
            start = moment(yearDate).startOf('month').toDate();
            end = moment(yearDate).endOf('month').toDate();

            asyncTasks = [];
            asyncTasks.push(function(cb){
                Reservation.count({
                reservation_type:'tour', createdAt: { '>': start, '<': end }
                }).exec(function(error, toursR) {
                    toursReservations.push(toursR);
                    cb();
                });
            });
            asyncTasks.push(function(cb){
                Reservation.count({
                reservation_type:'hotel', createdAt: { '>': start, '<': end }
                }).exec(function(error, hotelsR) {
                    var m = month;                    
                    hotelsReservations.push(hotelsR);
                    cb();
                });
            });
            asyncTasks.push(function(cb){
                Reservation.count({
                reservation_type:'transfer', createdAt: { '>': start, '<': end }
                }).exec(function(error, transfersR) {
                    transfersReservations.push(transfersR);
                    cb();
                });
            });

            async.parallel(asyncTasks,function(){
                response = {
                    toursReservations : toursReservations,
                    hotelsReservations : hotelsReservations,
                    transfersReservations : transfersReservations,
                };
                callback(null,response);
            });

        },
        function (err, results) {
            res.json(response);
        });
    }
};

function isValidDate(d) {
    if ( Object.prototype.toString.call(d) !== "[object Date]" )
        return false;
    return !isNaN(d.getTime());
}