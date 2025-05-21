const db = require("../models");
const Supplier = db.supplier;
const Product = db.product;
const User = db.user;
const Role = db.role;

// Función para verificar permisos
const checkPermissions = async (userId, requiredPermission) => {
  const user = await User.findById(userId).populate('roles');
  if (!user) return false;

  const roles = user.roles.map(role => role.name);

  if (roles.includes('admin')) return true;
  if (requiredPermission === 'read' && roles.includes('auxiliar')) return true;
  if (requiredPermission !== 'delete' && roles.includes('coordinador')) return true;

  return false;
};

// Crear proveedor (Admin y Coordinador)
exports.createSupplier = async (req, res) => {
  try {
    const hasPermission = await checkPermissions(req.userId, 'create');
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para crear proveedores"
      });
    }

    // Validar relación con producto
    if (req.body.products && req.body.products.length > 0) {
      const products = await Product.find({ _id: { $in: req.body.products } });
      if (products.length !== req.body.products.length) {
        return res.status(400).json({
          success: false,
          message: "Algunos productos no existen"
        });
      }
    }

    const newSupplier = new Supplier({
      name: req.body.name,
      contact: req.body.contact,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      products: req.body.products || [],
      createdBy: req.userId
    });

    const savedSupplier = await newSupplier.save();
    
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
      message: "Error al crear proveedor",
      error: error.message
    });
  }
};

// Obtener todos los proveedores (todos los roles)
exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find()
      .populate('products', 'name price')
      .populate('createdBy', 'username');
      
    res.status(200).json({
      success: true,
      data: suppliers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener proveedores",
      error: error.message
    });
  }
};

// Obtener un proveedor por ID (todos los roles)
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
      message: "Error al obtener proveedor",
      error: error.message
    });
  }
};

// Actualizar proveedor (Admin y Coordinador)
exports.updateSupplier = async (req, res) => {
  try {
    const hasPermission = await checkPermissions(req.userId, 'update');
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para actualizar proveedores"
      });
    }

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
      message: "Error al actualizar proveedor",
      error: error.message
    });
  }
};

// Eliminar proveedor (Solo Admin)
exports.deleteSupplier = async (req, res) => {
  try {
    const hasPermission = await checkPermissions(req.userId, 'delete');
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: "Solo los administradores pueden eliminar proveedores"
      });
    }

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
      message: "Error al eliminar proveedor",
      error: error.message
    });
  }
};