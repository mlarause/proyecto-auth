const Supplier = require('../models/Supplier');

// CREATE (idéntico a createCategory)
exports.createSupplier = async (req, res) => {
  try {
    const { name, contact, email, phone, address, products } = req.body;

    // Validación como en categorías
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
      products,
      createdBy: req.userId
    });

    await newSupplier.save();

    res.status(201).json({ 
      success: true, 
      data: newSupplier,
      message: 'Proveedor creado exitosamente'
    });

  } catch (error) {
    // Manejo de errores como en categorías
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'El proveedor ya existe'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al crear proveedor: ' + error.message
    });
  }
};

// GET ALL (igual a getCategories)
exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().populate('products');
    res.status(200).json({ 
      success: true, 
      data: suppliers 
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener proveedores: ' + error.message
    });
  }
};

// GET BY ID (igual a getCategoryById)
exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id).populate('products');
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
      message: 'Error al obtener proveedor: ' + error.message
    });
  }
};

// UPDATE (igual a updateCategory)
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
      data: updatedSupplier,
      message: 'Proveedor actualizado exitosamente'
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
      message: 'Error al actualizar proveedor: ' + error.message
    });
  }
};

// DELETE (igual a deleteCategory)
exports.deleteSupplier = async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!deletedSupplier) {
      return res.status(404).json({
        success: false,
        message: 'Proveedor no encontrado'
      });
    }
    res.status(200).json({ 
      success: true,
      message: 'Proveedor eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar proveedor: ' + error.message
    });
  }
};