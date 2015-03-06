/**
* SeasonSqueme.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		seasons : {
			collection : 'season',
			via : 'scheme',
		},
		hotels : {
			collection : 'hotel',
			via : 'seasonScheme',
		},
		tours:{
			collection:'tour',
			via:'seasonScheme',
		}
	}
};

