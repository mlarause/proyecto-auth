const Supplier = require('../models/Supplier');

// CREATE
exports.createSupplier = async (req, res) => {
  try {
    const { name, contact, email, phone, address, products } = req.body;

    // Validación como en tu controlador de categorías
    if (!name || !contact || !email || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios'
      });
    }

    const newSupplier = new Supplier({
      name,
      contact,
      email,
      phone,
      address,
      products: products || [],
      createdBy: req.userId
    });

    await newSupplier.save();

    res.status(201).json({
      success: true,
      data: newSupplier
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'El proveedor ya existe'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL
exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json({
      success: true,
      data: suppliers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET ONE
exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Proveedor no encontrado'
      });
    }
    res.status(200).json({
      success: true,
      data: supplier
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE
exports.updateSupplier = async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedSupplier) {
      return res.status(404).json({
        success: false,
        message: 'Proveedor no encontrado'
      });
    }
    res.status(200).json({
      success: true,
      data: updatedSupplier
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Proveedor no encontrado'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Proveedor eliminado'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};