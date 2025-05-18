const mongoose = require("mongoose");

const SubCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
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

// Validación para evitar subcategorías duplicadas en una misma categoría
SubCategorySchema.index({ name: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("SubCategory", SubCategorySchema);