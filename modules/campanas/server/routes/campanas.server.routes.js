'use strict';

/**
 * Module dependencies
 */
var campanasPolicy = require('../policies/campanas.server.policy'),
  campanas = require('../controllers/campanas.server.controller');

module.exports = function(app) {
  // Campanas Routes
  app.route('/api/campanas').all(campanasPolicy.isAllowed)
    .get(campanas.list)
    .post(campanas.create);

  app.route('/api/campanas/:campanaId').all(campanasPolicy.isAllowed)
    .get(campanas.read)
    .put(campanas.update)
    .delete(campanas.delete);

  // Finish by binding the Campana middleware
  app.param('campanaId', campanas.campanaByID);
};
