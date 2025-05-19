const Supplier = require("../models/Supplier");

// Crear proveedor
exports.createSupplier = async (req, res) => {
  try {
    const { name, contact, email, phone, address, products } = req.body;
    
    const newSupplier = new Supplier({
      name,
      contact,
      email,
      phone,
      address,
      products,
      createdBy: req.userId // Opcional: guardar quién lo creó
    });

    await newSupplier.save();
    res.status(201).json({ success: true, data: newSupplier });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Obtener todos los proveedores
exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json({ success: true, data: suppliers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener un proveedor por ID
exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: "Proveedor no encontrado" });
    }
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Actualizar proveedor
exports.updateSupplier = async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedSupplier) {
      return res.status(404).json({ success: false, message: "Proveedor no encontrado" });
    }
    res.status(200).json({ success: true, data: updatedSupplier });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Eliminar proveedor
exports.deleteSupplier = async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!deletedSupplier) {
      return res.status(404).json({ success: false, message: "Proveedor no encontrado" });
    }
    res.status(200).json({ success: true, message: "Proveedor eliminado" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};