const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    unique: true,
    trim: true,
    lowercase: true // Convertir a minúsculas para evitar duplicados case-sensitive
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

// Eliminar índices existentes primero
categorySchema.pre('save', async function(next) {
  try {
    await this.constructor.collection.dropIndex('name_1');
  } catch (err) {
    // Ignorar si el índice no existe
    if (!err.message.includes('index not found')) {
      return next(err);
    }
  }
  next();
});

// Crear nuevo índice con collation para case-insensitive
categorySchema.index({ name: 1 }, { 
  unique: true,
  collation: { locale: 'es', strength: 2 } // strength 2 = case-insensitive
});

module.exports = mongoose.model('Category', categorySchema);