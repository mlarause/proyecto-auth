const Supplier = require('../models/Supplier');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

/**
 * @desc    Crear un nuevo proveedor
 * @route   POST /api/suppliers
 * @access  Privado/Admin
 */
exports.createSupplier = async (req, res) => {
  // Validación de express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { name, contact, email, phone, address, products } = req.body;

    // Validar que existan los productos
    const existingProducts = await Product.countDocuments({
      _id: { $in: products }
    });

    if (existingProducts !== products.length) {
      return res.status(400).json({
        success: false,
        message: 'Uno o más productos no existen'
      });
    }

    // Crear el proveedor
    const supplier = new Supplier({
      name,
      contact,
      email,
      phone,
      address,
      products,
      createdBy: req.user.id
    });

    // Guardar en la base de datos
    const savedSupplier = await supplier.save();

    // Obtener el proveedor con datos poblados
    const supplierWithDetails = await Supplier.findById(savedSupplier._id)
      .populate('products', 'name price')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Proveedor creado exitosamente',
      data: supplierWithDetails
    });

  } catch (error) {
    console.error('Error en createSupplier:', error);
    
    // Manejo de errores de MongoDB
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un proveedor con ese nombre o email'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al crear el proveedor',
      error: error.message
    });
  }
};

/**
 * @desc    Obtener todos los proveedores
 * @route   GET /api/suppliers
 * @access  Privado/Admin
 */
exports.getSuppliers = async (req, res) => {
  try {
    // Construir query
    let query = {};
    
    // Filtrar por producto si se especifica
    if (req.query.product) {
      query.products = req.query.product;
    }

    // Paginación
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Obtener proveedores
    const suppliers = await Supplier.find(query)
      .populate('products', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Contar total de proveedores
    const total = await Supplier.countDocuments(query);

    res.status(200).json({
      success: true,
      count: suppliers.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: suppliers
    });

  } catch (error) {
    console.error('Error en getSuppliers:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los proveedores'
    });
  }
};

/**
 * @desc    Obtener un proveedor por ID
 * @route   GET /api/suppliers/:id
 * @access  Privado/Admin
 */
exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id)
      .populate('products', 'name description price')
      .populate('createdBy', 'name email');

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
    console.error('Error en getSupplierById:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de proveedor inválido'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al obtener el proveedor'
    });
  }
};

/**
 * @desc    Actualizar un proveedor
 * @route   PUT /api/suppliers/:id
 * @access  Privado/Admin
 */
exports.updateSupplier = async (req, res) => {
  // Validación de express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { products, ...updateData } = req.body;

    // Validar productos si se están actualizando
    if (products) {
      const productsExist = await Product.countDocuments({ 
        '_id': { $in: products } 
      });
      
      if (productsExist !== products.length) {
        return res.status(400).json({
          success: false,
          message: 'Uno o más productos no existen'
        });
      }
      
      updateData.products = products;
    }

    // Actualizar el proveedor
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true,
        runValidators: true
      }
    )
    .populate('products', 'name')
    .populate('createdBy', 'name email');

    if (!updatedSupplier) {
      return res.status(404).json({
        success: false,
        message: 'Proveedor no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Proveedor actualizado exitosamente',
      data: updatedSupplier
    });

  } catch (error) {
    console.error('Error en updateSupplier:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un proveedor con ese nombre o email'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al actualizar el proveedor'
    });
  }
};

/**
 * @desc    Eliminar un proveedor
 * @route   DELETE /api/suppliers/:id
 * @access  Privado/Admin
 */
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
      message: 'Proveedor eliminado exitosamente',
      data: supplier
    });

  } catch (error) {
    console.error('Error en deleteSupplier:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de proveedor inválido'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al eliminar el proveedor'
    });
  }
};

/**
 * @desc    Obtener proveedores por producto
 * @route   GET /api/suppliers/product/:productId
 * @access  Privado/Admin
 */
exports.getSuppliersByProduct = async (req, res) => {
  try {
    const suppliers = await Supplier.find({ products: req.params.productId })
      .populate('products', 'name')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: suppliers.length,
      data: suppliers
    });

  } catch (error) {
    console.error('Error en getSuppliersByProduct:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener proveedores por producto'
    });
  }
};