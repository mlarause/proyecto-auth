const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const supplierSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  contact: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un email válido']
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Índices para mejor performance
supplierSchema.index({ name: 1 });
supplierSchema.index({ email: 1 }, { unique: true });

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;