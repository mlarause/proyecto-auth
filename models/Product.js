const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    required: true,
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { 
  timestamps: true,
});

// Validación para evitar productos duplicados bajo una misma subcategoría
ProductSchema.index({ name: 1, subcategory: 1 }, { unique: true });

module.exports = mongoose.model("Product", ProductSchema);