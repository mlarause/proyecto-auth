const Product = require('../models/Product');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const Supplier = require('../models/Supplier');

exports.create = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria, subcategoria, proveedor, stock } = req.body;
    
    // Validar relaciones
    const [catExist, subcatExist, provExist] = await Promise.all([
      Category.findById(categoria),
      Subcategory.findById(subcategoria),
      Supplier.findById(proveedor)
    ]);

    if (!catExist || !subcatExist || !provExist) {
      return res.status(400).json({ message: 'Categoría, subcategoría o proveedor no válidos' });
    }

    const product = new Product({
      nombre,
      descripcion,
      precio,
      categoria,
      subcategoria,
      proveedor,
      stock
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('categoria', 'nombre')
      .populate('subcategoria', 'nombre')
      .populate('proveedor', 'nombre');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('categoria', 'nombre descripcion')
      .populate('subcategoria', 'nombre descripcion')
      .populate('proveedor', 'nombre contacto');
    
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('categoria subcategoria proveedor');
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};