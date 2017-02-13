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
  descripcion: {
    type: String,
    default: '',
    required: 'DescripcionE requerida',
    trim: true
  },
  material: {
    type: String,
    default: '',
    required: 'Material requerido',
    trim: true
  },
  codigo: {
    type: String,
    default: '',
    required: 'Código requerido',
    trim: true
  },
  latitud: {
    type: String,
    required: 'Latitud requerida',
  },
  longitud: {
    type: String,
    required: 'Longitud requerida',
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
