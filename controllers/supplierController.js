const Supplier = require('../models/Supplier');

// Controlador para crear proveedor
const createSupplier = async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.status(201).json({ success: true, data: supplier });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Controlador para obtener todos los proveedores
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json({ success: true, data: suppliers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controlador para obtener un proveedor por ID
const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Proveedor no encontrado' });
    }
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controlador para actualizar proveedor
const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true
    });
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Proveedor no encontrado' });
    }
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Controlador para eliminar proveedor
const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Proveedor no encontrado' });
    }
    res.status(200).json({ success: true, message: 'Proveedor eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Exportación explícita de todos los controladores
module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier
};