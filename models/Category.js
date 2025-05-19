const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  nombre: {  // Cambié 'name' a 'nombre' para coincidir con tu error
    type: String,
    required: [true, 'El nombre es obligatorio'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Manejo mejorado de errores de duplicados
categorySchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Ya existe una categoría con ese nombre'));
  } else {
    next(error);
  }
});

// Eliminar índice duplicado si existe
categorySchema.index({ nombre: 1 }, { unique: true, partialFilterExpression: { nombre: { $type: 'string' } } });

module.exports = mongoose.model('Category', categorySchema);