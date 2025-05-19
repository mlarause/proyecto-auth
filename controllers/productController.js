const Product = require('../models/Product');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');

// @desc    Crear un nuevo producto
// @route   POST /api/products
// @access  Admin
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, subcategory } = req.body;

    // Validación de campos requeridos
    if (!name || !description || !price || !stock || !category || !subcategory) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios'
      });
    }

    // Verificar que existan la categoría y subcategoría
    const [parentCategory, parentSubcategory] = await Promise.all([
      Category.findById(category),
      Subcategory.findById(subcategory)
    ]);

    if (!parentCategory || !parentSubcategory) {
      return res.status(404).json({
        success: false,
        message: 'Categoría o subcategoría no encontrada'
      });
    }

    // Verificar que la subcategoría pertenezca a la categoría
    if (parentSubcategory.category.toString() !== category) {
      return res.status(400).json({
        success: false,
        message: 'La subcategoría no pertenece a la categoría especificada'
      });
    }

    const newProduct = new Product({
      name: name.trim(),
      description: description.trim(),
      price,
      stock,
      category,
      subcategory
    });

    await newProduct.save();

    // Populate para mostrar los datos relacionados
    const productWithRelations = await Product.findById(newProduct._id)
      .populate('category', 'name')
      .populate('subcategory', 'name');

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: productWithRelations
    });

  } catch (error) {
    console.error('Error en createProduct:', error);
    
    // Manejo de errores de MongoDB
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un producto con ese nombre'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al crear producto',
      error: error.message
    });
  }
};

// @desc    Obtener todos los productos
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    // Filtrar por categoría o subcategoría si se especifica
    let filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.subcategory) filter.subcategory = req.query.subcategory;

    const products = await Product.find(filter)
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error en getProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos'
    });
  }
};

// @desc    Obtener un producto por ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name description')
      .populate('subcategory', 'name description');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error en getProductById:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener producto'
    });
  }
};

// @desc    Actualizar un producto
// @route   PUT /api/products/:id
// @access  Admin
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, subcategory } = req.body;
    const updateData = {};

    // Validar campos a actualizar
    if (name) updateData.name = name.trim();
    if (description) updateData.description = description.trim();
    if (price) updateData.price = price;
    if (stock) updateData.stock = stock;
    if (category) updateData.category = category;
    if (subcategory) updateData.subcategory = subcategory;

    // Validar relaciones si se actualizan
    if (category || subcategory) {
      const [parentCategory, parentSubcategory] = await Promise.all([
        category ? Category.findById(category) : null,
        subcategory ? Subcategory.findById(subcategory) : null
      ]);

      if ((category && !parentCategory) || (subcategory && !parentSubcategory)) {
        return res.status(404).json({
          success: false,
          message: 'Categoría o subcategoría no encontrada'
        });
      }

      // Verificar relación entre categoría y subcategoría
      if (category && subcategory && parentSubcategory.category.toString() !== category) {
        return res.status(400).json({
          success: false,
          message: 'La subcategoría no pertenece a la categoría especificada'
        });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('category', 'name')
    .populate('subcategory', 'name');

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Producto actualizado',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error en updateProduct:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un producto con ese nombre'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al actualizar producto'
    });
  }
};

// @desc    Eliminar un producto
// @route   DELETE /api/products/:id
// @access  Admin
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Producto eliminado',
      data: deletedProduct
    });
  } catch (error) {
    console.error('Error en deleteProduct:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar producto'
    });
  }
};

// @desc    Obtener productos por categoría
// @route   GET /api/products/category/:categoryId
// @access  Public
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId })
      .populate('subcategory', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error en getProductsByCategory:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos por categoría'
    });
  }
};

// @desc    Obtener productos por subcategoría
// @route   GET /api/products/subcategory/:subcategoryId
// @access  Public
exports.getProductsBySubcategory = async (req, res) => {
  try {
    const products = await Product.find({ subcategory: req.params.subcategoryId })
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error en getProductsBySubcategory:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos por subcategoría'
    });
  }
};