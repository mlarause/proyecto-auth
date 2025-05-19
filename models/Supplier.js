const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

// Middleware para manejar errores de duplicados (corregido: usa SupplierSchema)
SupplierSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('El correo ya está registrado'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model("Supplier", SupplierSchema);