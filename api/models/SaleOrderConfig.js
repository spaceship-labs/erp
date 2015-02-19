/**
 * SaleOrderConfig.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

        authorizationRoles : {
            collection : 'UserRole'
        },

        prepressRoles : {
            collection : 'UserRole'
        },

        pressRoles : {
            collection : 'UserRole'
        },

        finishingRoles : {
            collection : 'UserRole'
        }

	}

};
