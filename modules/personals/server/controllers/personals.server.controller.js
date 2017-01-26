'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Personal = mongoose.model('Personal'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Personal
 */
exports.create = function(req, res) {
  var personal = new Personal(req.body);
  personal.user = req.user;

  personal.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(personal);
    }
  });
};

/**
 * Show the current Personal
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var personal = req.personal ? req.personal.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  personal.isCurrentUserOwner = req.user && personal.user && personal.user._id.toString() === req.user._id.toString();

  res.jsonp(personal);
};

/**
 * Update a Personal
 */
exports.update = function(req, res) {
  var personal = req.personal;

  personal = _.extend(personal, req.body);

  personal.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(personal);
    }
  });
};

/**
 * Delete an Personal
 */
exports.delete = function(req, res) {
  var personal = req.personal;

  personal.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(personal);
    }
  });
};

/**
 * List of Personals
 */
exports.list = function(req, res) {
  Personal.find().sort('-created').populate('user', 'displayName').exec(function(err, personals) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(personals);
    }
  });
};

/**
 * Personal middleware
 */
exports.personalByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Personal is invalid'
    });
  }

  Personal.findById(id).populate('user', 'displayName').exec(function (err, personal) {
    if (err) {
      return next(err);
    } else if (!personal) {
      return res.status(404).send({
        message: 'No Personal with that identifier has been found'
      });
    }
    req.personal = personal;
    next();
  });
};
