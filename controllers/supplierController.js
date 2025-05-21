const db = require("../models");
const Supplier = db.supplier;
const Product = db.product;
const User = db.user;

// Crear un nuevo proveedor
exports.createSupplier = async (req, res) => {
  try {
    // Validar productos si existen
    if (req.body.products && req.body.products.length > 0) {
      const products = await Product.find({ _id: { $in: req.body.products } });
      if (products.length !== req.body.products.length) {
        return res.status(400).json({ 
          success: false,
          message: "Algunos productos no existen" 
        });
      }
    }

    const supplier = new Supplier({
      name: req.body.name,
      contact: req.body.contact,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      products: req.body.products || [],
      createdBy: req.userId
    });

    const savedSupplier = await supplier.save();
    
    res.status(201).json({
      success: true,
      data: savedSupplier
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "El email ya está registrado"
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Obtener todos los proveedores
exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find()
      .populate('products', 'name price')
      .populate('createdBy', 'username email');
      
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

// Obtener un proveedor por ID
exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id)
      .populate('products')
      .populate('createdBy', 'username');
      
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Proveedor no encontrado"
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

// Actualizar un proveedor
exports.updateSupplier = async (req, res) => {
  try {
    // Validar productos si se actualizan
    if (req.body.products) {
      const products = await Product.find({ _id: { $in: req.body.products } });
      if (products.length !== req.body.products.length) {
        return res.status(400).json({ 
          success: false,
          message: "Algunos productos no existen" 
        });
      }
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('products');

    if (!updatedSupplier) {
      return res.status(404).json({
        success: false,
        message: "Proveedor no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      data: updatedSupplier
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "El email ya está registrado"
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Eliminar un proveedor
exports.deleteSupplier = async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
    
    if (!deletedSupplier) {
      return res.status(404).json({
        success: false,
        message: "Proveedor no encontrado"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Proveedor eliminado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};