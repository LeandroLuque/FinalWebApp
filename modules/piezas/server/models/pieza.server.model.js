'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Estado Schema
 */

var EstadoSchema = new Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  responsable: {
    type: String,
  },
  observaciones: {
    type: String,
  },
  tipo: {
    type: String,
  },
  imagen: {
    type: String,
    default: 'modules/piezas/client/img/noimagefound.jpg'
  }
})

/**
 * Pieza Schema
 */
var PiezaSchema = new Schema({
  descripcion: {
    type: String,
    default: '',
    required: 'Descripcion requerida',
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
  estados: [EstadoSchema],
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
