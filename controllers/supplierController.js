const Supplier = require("../models/Supplier");

// Crear proveedor
exports.createSupplier = async (req, res) => {
  try {
    // Validar datos requeridos
    const { name, contact, email, phone, address } = req.body;
    if (!name || !contact || !email || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios"
      });
    }

    // Verificar si el email ya existe
    const existingSupplier = await Supplier.findOne({ email });
    if (existingSupplier) {
      return res.status(400).json({
        success: false,
        message: "El correo ya está registrado"
      });
    }

    const newSupplier = new Supplier({
      ...req.body,
      createdBy: req.userId // Asignar el usuario que lo creó
    });

    await newSupplier.save();
    res.status(201).json({ success: true, data: newSupplier });

  } catch (error) {
    console.error("Error al crear proveedor:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Algo salió mal al crear el proveedor"
    });
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