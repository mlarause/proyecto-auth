const mongoose = require('mongoose');
const { Schema } = mongoose;

const SupplierSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  contacto: String,
  telefono: String,
  direccion: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Supplier', SupplierSchema);