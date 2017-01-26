'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Pieza Schema
 */
var PiezaSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Pieza name',
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

mongoose.model('Pieza', PiezaSchema);
