/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  //- root route
  '/': {
    
  },

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/


  //- User routes
  'POST /api/register':{
    controller: 'UserController',
    action: 'register',
  },

  'POST /api/login':{
    controller: 'UserController',
    action: 'login',
  },

  'POST /api/verify/:token':{
    controller: 'UserController',
    action: 'verifyToken',
  },

  'POST /api/test':{
    controller: 'UserController',
    action: 'test',
  },

  'POST /api/user/upload/image':{
    controller: 'UserController',
    action: 'uploadImage',
  },

  //- Chef routes
  'POST /api/chef/create':{
    controller: 'ChefController',
    action: 'create',
  },

  'PUT /api/chef/update':{
    controller: 'ChefController',
    action: 'update'
  },

  // 'GET /api/image':{
  //   controller: 'ChefController',
  //   action: 'update',
  // },

  'GET /api/chef/viewAll':{
    controller: 'ChefController',
    action: 'viewAll',
  },

  'GET /api/chef/viewByID':{
    controller: 'ChefController',
    action: 'viewByID',
  },

  'DELETE /api/chef/delete':{
    controller: 'ChefController',
    action: 'delete',
  },

  //- Dish routes
  'POST /api/dish/create': {
    controller: 'DishController',
    action: 'create'
  },

  'POST /api/dish/create/ingredients':{
    controller: 'DishController',
    action: 'addIngredientsToDish',
  },
  
  'POST /api/dish/create/allergies':{
    controller: 'DishController',
    action: 'addAllergiesToDish',
  },

  'POST /api/dish/create/dietaries':{
    controller: 'DishController',
    action: 'addDietariesToDish',
  },

  //- Menu routes
  'POST /api/menu/create':{
    controller: 'MenuController',
    action: 'create',
  },

  'POST /api/menu/add/dish':{
    controller: 'MenuController',
    action: 'addDishToMenu',
  },

  'POST /api/menu/view/dish':{
    controller: 'MenuController',
    action: 'viewMenuDishes'
  },

  'POST /api/dish/view/menu':{
    controller: 'MenuController',
    action: 'viewDishMenu'
  },


};
