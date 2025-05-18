const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { 
  timestamps: true,
});

// Validación para evitar categorías duplicadas
CategorySchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("Category", CategorySchema);