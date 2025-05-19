const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    unique: true,
    trim: true,
    index: true
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
categorySchema.index({ name: 1 }, { 
  unique: true,
  partialFilterExpression: { name: { $exists: true, $type: 'string' } }
});

module.exports = mongoose.model('Category', categorySchema);