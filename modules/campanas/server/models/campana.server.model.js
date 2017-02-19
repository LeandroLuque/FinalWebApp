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
    required: 'Completar este campo',
    trim: true
  },
  responsable: {
    type: String,
    default: '',
    required: 'Completar este campo',
    trim: true
  },
  motivo: {
    type: String,
    default: '',
    required: 'Completar este campo',
    trim: true
  },
  latitud: {
    type: Number, 
    required: 'Completar este campo'
  },
  longitud: {
    type: Number, 
    required: 'Completar este campo'
  },
  piezas:[
    {
      type: Schema.ObjectId,
      ref: 'Pieza'
    }
  ],
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
