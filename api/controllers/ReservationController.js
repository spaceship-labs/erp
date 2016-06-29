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
    update : function(req,res){
        var params = req.params.all();
        if( params.item.id ){
            var item = params.item;
            if( item.company && item.company.id ) item.company = item.company.id;
            if( item.currency && item.currency.id ) item.currency = item.currency.id;
            //item.req = req;
            console.log('------------------------------------item');
            console.log(item);
            console.log('item-.----------------------------------');
            var orderParams = { state : params.item.state, payment_method : params.item.payment_method, currency : params.item.currency };
            OrderCore.updateOrderParams(params.item.order,orderParams,function(err,order){
                if(err) return res.json(false);
                Reservation.update({id:item.id},item,function(err,r){
                    Reservation.find({id:item.id}).exec(function(error, reservation) {
                        return res.json(reservation);
                    });
                });
            });
        }else{
            return res.json(false);
        }
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
        var start, end, monthDayCount;

        if(params.start){
            start = moment(params.start).startOf('month').toDate();
            end = moment(start).endOf('month').toDate();
            monthDaysCount = moment(end).diff(start, 'days') + 1;


            asyncTasks.push(function(cb){
                Reservation.find({
                reservation_type:'tour', createdAt: { '>': start, '<': end }
                }).exec(function(error, toursR) {
                    toursReservations = toursR;
                    cb();
                });
            }); 

            asyncTasks.push(function(cb){
                Reservation.find({
                reservation_type:'hotel', createdAt: { '>': start, '<': end }
                }).exec(function(error, hotelsR) {
                    hotelsReservations = hotelsR;
                    cb();
                });
            }); 

            asyncTasks.push(function(cb){
                Reservation.find({
                reservation_type:'transfer', createdAt: { '>': start, '<': end }
                }).exec(function(error, transfersR) {
                    transfersReservations = transfersR;
                    cb();
                });
            }); 	

            async.parallel(asyncTasks,function(){
                var reservations = [toursReservations, hotelsReservations, transfersReservations];
                var response = new Array([],[],[]);
                for(var i= 0; i<reservations.length;i++){
                    for(var j = 0;j<monthDaysCount;j++){
                        response[i][j] = 0;
                    }
                }
                var numericIndex = 0;
                _.forEach(reservations,function(cat){
                    _.forEach(cat,function(reservation){
                        for(var d=1; d<monthDaysCount+1; d++){
                            var dayOfMonth = moment(reservation.createdAt).format('DD');
                            if(parseInt(dayOfMonth) == d){
                                response[numericIndex][d-1]++;
                            }
                        }                           
                    });
                    numericIndex++;
                });
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
    },
    feeCategoriesInMonth : function(req,res){
        var asyncTasks = [];
        var toursReservations = [];
        var hotelsReservations = [];
        var transfersReservations = [];
        var params = req.params.all();
        var start, end, monthDayCount;

        if(params.start){
            start = moment(params.start).startOf('month').toDate();
            end = moment(start).endOf('month').toDate();
            monthDaysCount = moment(end).diff(start, 'days') + 1;


            asyncTasks.push(function(cb){
                Reservation.find({
                reservation_type:'tour', createdAt: { '>': start, '<': end }
                }).exec(function(error, toursR) {
                    toursReservations = toursR;
                    cb();
                });
            }); 

            asyncTasks.push(function(cb){
                Reservation.find({
                reservation_type:'hotel', createdAt: { '>': start, '<': end }
                }).exec(function(error, hotelsR) {
                    hotelsReservations = hotelsR;
                    cb();
                });
            }); 

            asyncTasks.push(function(cb){
                Reservation.find({
                reservation_type:'transfer', createdAt: { '>': start, '<': end }
                }).exec(function(error, transfersR) {
                    transfersReservations = transfersR;
                    cb();
                });
            });     

            async.parallel(asyncTasks,function(){
                var reservations = [toursReservations, hotelsReservations, transfersReservations];
                var response = new Array([],[],[]);
                for(var i= 0; i<reservations.length;i++){
                    for(var j = 0;j<monthDaysCount;j++){
                        response[i][j] = 0;
                    }
                }
                var numericIndex = 0;
                _.forEach(reservations,function(cat){
                    _.forEach(cat,function(reservation){
                        for(var d=1; d<monthDaysCount+1; d++){
                            var dayOfMonth = moment(reservation.createdAt).format('DD');
                            if(parseInt(dayOfMonth) == d){
                                response[numericIndex][d-1] += reservation.fee;
                            }
                        }                           
                    });
                    numericIndex++;
                });
                res.json(response);
            });
        }
    },
    feeCategoriesInYear: function(req,res){
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
                Reservation.find({
                reservation_type:'tour', createdAt: { '>': start, '<': end }
                }).sum('fee').exec(function(error, toursR) {
                    if(toursR.length > 0){
                        toursReservations.push(toursR[0].fee);
                    }else{
                        toursReservations.push(0);
                    }
                    cb();
                });
            });
            asyncTasks.push(function(cb){
                Reservation.find({
                reservation_type:'hotel', createdAt: { '>': start, '<': end }
                }).sum('fee').exec(function(error, hotelsR) {
                    if(hotelsR.length > 0){
                        hotelsReservations.push(hotelsR[0].fee);
                    }else{
                        hotelsReservations.push(0);
                    }
                    cb();
                });
            });
            asyncTasks.push(function(cb){
                Reservation.find({
                reservation_type:'transfer', createdAt: { '>': start, '<': end }
                }).sum('fee').exec(function(error, transfersR) {
                    if(transfersR.length > 0){
                        transfersReservations.push(transfersR[0].fee);

                    }else{
                        transfersReservations.push(0);
                    }
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