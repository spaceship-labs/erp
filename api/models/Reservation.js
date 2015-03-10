/**
* Reservation.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	attributes: {	
		order : {
			model : 'order',
		},
		client : {
			model : 'client_'
		},
		airport : {
			model : 'airport'
		},
		tour : {
			model : 'tour'
		},
		hotel : {
			model : 'hotel'
		},
		transfer : {
			model : 'transfer'
		},
		fee : 'integer'
	}
  	,migrate : "safe"
}