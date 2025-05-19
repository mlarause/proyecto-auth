const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
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

// Manejar error de duplicado (E11000)
categorySchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Ya existe una categoría con ese nombre'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model('Category', categorySchema);