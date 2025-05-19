const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  contact: {
    type: String,
    required: [true, 'El contacto es requerido']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    match: [/.+\@.+\..+/, 'Por favor ingrese un email válido']
  },
  phone: {
    type: String,
    required: [true, 'El teléfono es requerido']
  },
  address: {
    type: String,
    required: [true, 'La dirección es requerida']
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  versionKey: false
});

// Manejo de errores de duplicados
SupplierSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('El correo electrónico ya está registrado'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model('Supplier', SupplierSchema);