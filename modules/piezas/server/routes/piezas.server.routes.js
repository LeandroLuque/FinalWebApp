'use strict';

/**
 * Module dependencies
 */
var piezasPolicy = require('../policies/piezas.server.policy'),
  piezas = require('../controllers/piezas.server.controller');

module.exports = function(app) {
  // Piezas Routes
  app.route('/api/piezas').all(piezasPolicy.isAllowed)
    .get(piezas.list)
    .post(piezas.create);

  app.route('/api/piezas/:piezaId').all(piezasPolicy.isAllowed)
    .get(piezas.read)
    .put(piezas.update)
    .delete(piezas.delete);

  // Finish by binding the Pieza middleware
  app.param('piezaId', piezas.piezaByID);
};
