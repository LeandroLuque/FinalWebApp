'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Pieza = mongoose.model('Pieza'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Pieza
 */
exports.create = function(req, res) {
  var pieza = new Pieza(req.body);
  pieza.user = req.user;
  console.log("Save pieza controller server");
  pieza.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pieza);
      
    }
  });
};

/**
 * Show the current Pieza
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var pieza = req.pieza ? req.pieza.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  pieza.isCurrentUserOwner = req.user && pieza.user && pieza.user._id.toString() === req.user._id.toString();

  res.jsonp(pieza);
};

/**
 * Update a Pieza
 */
exports.update = function(req, res) {
  var pieza = req.pieza;

  pieza = _.extend(pieza, req.body);

  pieza.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pieza);
    }
  });
};

/**
 * Delete an Pieza
 */
exports.delete = function(req, res) {
  var pieza = req.pieza;

  pieza.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pieza);
    }
  });
};

/**
 * List of Piezas
 */
exports.list = function(req, res) {
  Pieza.find().sort('-created').populate('user', 'displayName').exec(function(err, piezas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(piezas);
    }
  });
};

/**
 * Pieza middleware
 */
exports.piezaByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Pieza is invalid'
    });
  }

  Pieza.findById(id).populate('user', 'displayName').exec(function (err, pieza) {
    if (err) {
      return next(err);
    } else if (!pieza) {
      return res.status(404).send({
        message: 'No Pieza with that identifier has been found'
      });
    }
    req.pieza = pieza;
    next();
  });
};
