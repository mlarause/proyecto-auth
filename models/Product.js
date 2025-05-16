const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: String,
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategoria: {
    type: Schema.Types.ObjectId,
    ref: 'Subcategory',
    required: true
  },
  proveedor: {
    type: Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);