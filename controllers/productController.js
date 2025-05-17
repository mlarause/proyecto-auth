const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

// Crear producto
exports.createProduct = async (req, res) => {
  try {
    // Verificación de token
    const token = req.headers['x-access-token'] || req.body.token;
    if (!token) return res.status(403).json({ message: "No se proporcionó token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    // Lógica principal
    const newProduct = new Product({
      ...req.body,
      user: req.userId
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Token inválido" });
    }
    res.status(500).json({ message: error.message });
  }
};

// Actualizar producto
exports.updateProduct = async (req, res) => {
  try {
    // Verificación de token
    const token = req.headers['x-access-token'] || req.body.token;
    if (!token) return res.status(403).json({ message: "No se proporcionó token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    // Lógica principal
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    if (product.user.toString() !== req.userId) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Token inválido" });
    }
    res.status(500).json({ message: error.message });
  }
};

// Eliminar producto
exports.deleteProduct = async (req, res) => {
  try {
    // Verificación de token
    const token = req.headers['x-access-token'] || req.body.token;
    if (!token) return res.status(403).json({ message: "No se proporcionó token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    // Lógica principal
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    if (product.user.toString() !== req.userId) {
      return res.status(403).json({ message: "No autorizado" });
    }

    await product.remove();
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Token inválido" });
    }
    res.status(500).json({ message: error.message });
  }
};