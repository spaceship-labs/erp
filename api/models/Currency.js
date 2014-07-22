/**
* Currency.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
	name:'string'
	,currency_code:'string'
	,prefix:'string'
	,suffix:'string'
	,companies : {
		collection : 'company',
		via : 'currencies',
	}
  }
};

