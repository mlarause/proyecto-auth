const Product = require('../models/Product');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const Supplier = require('../models/Supplier');

// Crear producto (Admin)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, subcategory, supplier } = req.body;
    
    // Validar relaciones
    const [categoryExists, subcategoryExists, supplierExists] = await Promise.all([
      Category.findById(category),
      Subcategory.findById(subcategory),
      Supplier.findById(supplier)
    ]);
    
    if (!categoryExists || !subcategoryExists || !supplierExists) {
      return res.status(400).json({ 
        success: false,
        message: 'Categoría, subcategoría o proveedor no válidos' 
      });
    }

    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
      subcategory,
      supplier
    });

    await product.save();
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al crear producto',
      error: error.message 
    });
  }
};

// Listar productos (Todos los roles)
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .populate('supplier', 'name');
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener productos',
      error: error.message 
    });
  }
};

// Actualizar producto (Admin y Coordinador)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Producto no encontrado' 
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al actualizar producto',
      error: error.message 
    });
  }
};

// Eliminar producto (Solo Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Producto no encontrado' 
      });
    }
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al eliminar producto',
      error: error.message 
    });
  }
};