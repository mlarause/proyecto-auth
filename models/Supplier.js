const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  address: String,
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }]
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);