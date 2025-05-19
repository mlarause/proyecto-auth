const Supplier = require('../models/Supplier');
const Product = require('../models/Product');

// [CREATE] Crear nuevo proveedor
exports.createSupplier = async (req, res) => {
  try {
    const { name, contact, email, phone, address, products } = req.body;

    // Validación como en tus otros controladores
    if (!name || !contact || !email || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios: nombre, contacto, email, teléfono o dirección'
      });
    }

    // Verificar productos existentes (si se proporcionan)
    if (products && products.length > 0) {
      const existingProducts = await Product.countDocuments({ _id: { $in: products } });
      if (existingProducts !== products.length) {
        return res.status(400).json({
          success: false,
          message: 'Uno o más productos no existen'
        });
      }
    }

    const newSupplier = new Supplier({
      name,
      contact,
      email,
      phone,
      address,
      products: products || [],
      createdBy: req.userId // ID del usuario que crea el proveedor
    });

    await newSupplier.save();

    res.status(201).json({
      success: true,
      data: newSupplier,
      message: 'Proveedor creado exitosamente'
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'El proveedor ya existe (email o nombre duplicado)'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al crear proveedor: ' + error.message
    });
  }
};

// [READ] Obtener todos los proveedores
exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find()
      .populate('products', 'name price') // Igual que en tu controlador de productos
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      count: suppliers.length,
      data: suppliers
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener proveedores: ' + error.message
    });
  }
};

// [READ] Obtener proveedor por ID
exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id)
      .populate('products', 'name description price')
      .populate('createdBy', 'name role');

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

// [UPDATE] Actualizar proveedor
exports.updateSupplier = async (req, res) => {
  try {
    const { name, contact, email, phone, address, products } = req.body;

    // Validación como en create
    if (!name || !contact || !email || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios'
      });
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      {
        name,
        contact,
        email,
        phone,
        address,
        products
      },
      { new: true, runValidators: true }
    ).populate('products');

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
        message: 'El email ya está registrado por otro proveedor'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al actualizar proveedor: ' + error.message
    });
  }
};

// [DELETE] Eliminar proveedor
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

// [SEARCH] Buscar proveedores (similar a tu implementación en productos)
exports.searchSuppliers = async (req, res) => {
  try {
    const { query } = req.params;
    const suppliers = await Supplier.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { contact: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);

    res.status(200).json({
      success: true,
      count: suppliers.length,
      data: suppliers
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en la búsqueda: ' + error.message
    });
  }
};