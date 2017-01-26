'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Campana Schema
 */
var CampanaSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Campana name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Campana', CampanaSchema);
