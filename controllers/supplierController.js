const mongoose = require('mongoose');
const User = mongoose.model('User');
const Supplier = mongoose.model('Supplier');
const Product = mongoose.model('Product');

// Función para verificar permisos
const checkSupplierPermission = async (userId, action) => {
  try {
    const user = await User.findById(userId).populate('roles').exec();
    if (!user) return false;

    const roles = user.roles.map(role => role.name);

    if (roles.includes('admin')) return true;
    if (action === 'read') return true;
    if (roles.includes('coordinador') && action !== 'delete') return true;
    
    return false;
  } catch (error) {
    console.error("Error verificando permisos:", error);
    return false;
  }
};

// Crear proveedor (Admin y Coordinador)
exports.createSupplier = async (req, res) => {
  try {
    const supplier = new Supplier({
      name: req.body.name,
      contact: req.body.contact || "",
      email: req.body.email,
      phone: req.body.phone || "",
      address: req.body.address || "",
      products: req.body.products || [],
      createdBy: req.userId
    });

    const savedSupplier = await supplier.save();
    
    res.status(201).json({
      success: true,
      data: savedSupplier,
      message: "Proveedor creado exitosamente"
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
      message: "Error al crear proveedor"
    });
  }
};

// Obtener todos los proveedores (todos los roles)
exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find()
      .populate('products', 'name price')
      .populate('createdBy', 'username')
      .exec();

    res.status(200).json({
      success: true,
      data: suppliers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener proveedores"
    });
  }
};

// Obtener proveedor por ID (todos los roles)
exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id)
      .populate('products', 'name price')
      .populate('createdBy', 'username')
      .exec();

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
      message: "Error al obtener proveedor"
    });
  }
};

// Actualizar proveedor (Admin y Coordinador)
exports.updateSupplier = async (req, res) => {
  try {
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
      data: updatedSupplier,
      message: "Proveedor actualizado exitosamente"
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
      message: "Error al actualizar proveedor"
    });
  }
};

// Eliminar proveedor (Solo Admin)
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
      message: "Proveedor eliminado exitosamente"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar proveedor"
    });
  }
};