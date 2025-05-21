const db = require("../models");

// Función para verificar permisos
const checkSupplierPermission = async (userId, action) => {
  try {
    const user = await db.User.findById(userId)
      .populate('roles')
      .exec();
      
    if (!user) return false;

    const roleNames = user.roles.map(role => role.name);

    if (roleNames.includes('admin')) return true;
    if (action === 'read') return true;
    if (roleNames.includes('coordinador') && action !== 'delete') return true;
    
    return false;
  } catch (error) {
    console.error("Error verificando permisos:", error);
    return false;
  }
};

// Crear proveedor (Admin y Coordinador)
exports.createSupplier = async (req, res) => {
  try {
    const canCreate = await checkSupplierPermission(req.userId, 'create');
    if (!canCreate) {
      return res.status(403).json({ 
        success: false,
        message: "No tienes permisos para esta acción" 
      });
    }

    const supplier = new db.Supplier({
      name: req.body.name,
      contact: req.body.contact || "",
      email: req.body.email,
      phone: req.body.phone || "",
      address: req.body.address || "",
      products: req.body.products || [],
      createdBy: req.userId
    });

    const savedSupplier = await supplier.save();
    
    return res.status(201).json({
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
    return res.status(500).json({
      success: false,
      message: "Error al crear proveedor"
    });
  }
};

// Obtener todos los proveedores (todos los roles)
exports.getAllSuppliers = async (req, res) => {
  try {
    const hasPermission = await checkSupplierPermission(req.userId, 'read');
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para ver proveedores"
      });
    }

    const suppliers = await db.Supplier.find()
      .populate('products', 'name price')
      .populate('createdBy', 'username')
      .exec();

    return res.status(200).json({
      success: true,
      data: suppliers
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener proveedores"
    });
  }
};

// Obtener proveedor por ID (todos los roles)
exports.getSupplierById = async (req, res) => {
  try {
    const hasPermission = await checkSupplierPermission(req.userId, 'read');
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para ver este proveedor"
      });
    }

    const supplier = await db.Supplier.findById(req.params.id)
      .populate('products', 'name price')
      .populate('createdBy', 'username')
      .exec();

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Proveedor no encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      data: supplier
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener proveedor"
    });
  }
};

// Actualizar proveedor (Admin y Coordinador)
exports.updateSupplier = async (req, res) => {
  try {
    const canUpdate = await checkSupplierPermission(req.userId, 'update');
    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para actualizar proveedores"
      });
    }

    const updatedSupplier = await db.Supplier.findByIdAndUpdate(
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

    return res.status(200).json({
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
    return res.status(500).json({
      success: false,
      message: "Error al actualizar proveedor"
    });
  }
};

// Eliminar proveedor (Solo Admin)
exports.deleteSupplier = async (req, res) => {
  try {
    const canDelete = await checkSupplierPermission(req.userId, 'delete');
    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para eliminar proveedores"
      });
    }

    const deletedSupplier = await db.Supplier.findByIdAndDelete(req.params.id);
    
    if (!deletedSupplier) {
      return res.status(404).json({
        success: false,
        message: "Proveedor no encontrado"
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Proveedor eliminado exitosamente"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al eliminar proveedor"
    });
  }
};