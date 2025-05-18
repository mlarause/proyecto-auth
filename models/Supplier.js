const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  contact: {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  address: {
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

module.exports = mongoose.model("Supplier", SupplierSchema);