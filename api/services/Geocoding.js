module.exports.geocode = function(location,cb){
	var geocoderProvider = 'google';
	var httpAdapter = 'http';
	var geocoder = require('node-geocoder').getGeocoder(geocoderProvider, httpAdapter);

	geocoder.geocode(location, cb);

};
module.exports.reverseGeocode = function(location,cb){
	var geocoderProvider = 'google';
	var httpAdapter = 'http';
	var geocoder = require('node-geocoder').getGeocoder(geocoderProvider, httpAdapter);
	geocoder.reverse(location.lat,location.lng,cb);
};