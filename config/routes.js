/**
 * Routes
 *
 * Your routes map URLs to views and controllers.
 * 
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.) 
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg` 
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or 
 * CoffeeScript for the front-end.
 *
 * For more information on routes, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.routes = {

  '/': {
     controller:'home'
  },
  '/entrar': {
    controller: 'session',
    action: 'new'
  },
  '/salir': {
    controller: 'session',
    action: 'destroy'
  },


  '/clientes' : {
      controller : 'client',
      action : 'index'
  },

  '/clientes/agregar' : {
      controller : 'client',
      action : 'add'
  },

  '/clientes/crear' : {
      controller : 'client',
      action : 'create'
  },

  '/clientes/editar/:id' : {
      controller : 'client',
      action : 'edit'
  },

  '/clientes/actualizar' : {
    controller : 'client',
    action : 'update'
  },

  '/ventas' : {
      controller : 'sale',
      action : 'index'
  },

  '/ventas/agregar' : {
      controller : 'sale',
      action : 'add'
  },

  '/ventas/crear' : {
      controller : 'sale',
      action : 'create'
  },

  '/ventas/editar/:id' : {
      controller : 'sale',
      action : 'edit'
  },

  'product_type/update' : {
      controller : 'product_type',
      action : 'update'
  }


};
