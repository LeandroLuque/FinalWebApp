'use strict';

/**
 * Module dependencies
 */
var personalsPolicy = require('../policies/personals.server.policy'),
  personals = require('../controllers/personals.server.controller');

module.exports = function(app) {
  // Personals Routes
  app.route('/api/personals').all(personalsPolicy.isAllowed)
    .get(personals.list)
    .post(personals.create);

  app.route('/api/personals/:personalId').all(personalsPolicy.isAllowed)
    .get(personals.read)
    .put(personals.update)
    .delete(personals.delete);

  // Finish by binding the Personal middleware
  app.param('personalId', personals.personalByID);
};
