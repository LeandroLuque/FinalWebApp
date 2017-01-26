'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Personal Schema
 */
var PersonalSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Personal name',
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

mongoose.model('Personal', PersonalSchema);
