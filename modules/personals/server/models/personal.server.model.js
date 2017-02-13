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
  nya: {
    type: String,
    default: '',
    required: 'Nombre es requerido',
    trim: true
  },
  dni: {
    type: Number,
    default: '',
    required: 'DNI es requerido',
    trim: true
  },
  rol: {
    type: String,
    default: '',
    required: 'Rol es requerido',
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
