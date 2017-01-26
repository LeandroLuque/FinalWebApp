'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Campana = mongoose.model('Campana'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Campana
 */
exports.create = function(req, res) {
  var campana = new Campana(req.body);
  campana.user = req.user;

  campana.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(campana);
    }
  });
};

/**
 * Show the current Campana
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var campana = req.campana ? req.campana.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  campana.isCurrentUserOwner = req.user && campana.user && campana.user._id.toString() === req.user._id.toString();

  res.jsonp(campana);
};

/**
 * Update a Campana
 */
exports.update = function(req, res) {
  var campana = req.campana;

  campana = _.extend(campana, req.body);

  campana.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(campana);
    }
  });
};

/**
 * Delete an Campana
 */
exports.delete = function(req, res) {
  var campana = req.campana;

  campana.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(campana);
    }
  });
};

/**
 * List of Campanas
 */
exports.list = function(req, res) {
  Campana.find().sort('-created').populate('user', 'displayName').exec(function(err, campanas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(campanas);
    }
  });
};

/**
 * Campana middleware
 */
exports.campanaByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Campana is invalid'
    });
  }

  Campana.findById(id).populate('user', 'displayName').exec(function (err, campana) {
    if (err) {
      return next(err);
    } else if (!campana) {
      return res.status(404).send({
        message: 'No Campana with that identifier has been found'
      });
    }
    req.campana = campana;
    next();
  });
};
