const Category = require('../models/Category');
const jwt = require('jsonwebtoken');

// Crear categoría
exports.createCategory = async (req, res) => {
  try {
    // Verificación de token
    const token = req.headers['x-access-token'] || req.body.token;
    if (!token) return res.status(403).json({ message: "No se proporcionó token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    // Lógica principal
    const newCategory = new Category({
      ...req.body,
      createdBy: req.userId
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Token inválido" });
    }
    res.status(500).json({ message: error.message });
  }
};

// Actualizar categoría
exports.updateCategory = async (req, res) => {
  try {
    // Verificación de token
    const token = req.headers['x-access-token'] || req.body.token;
    if (!token) return res.status(403).json({ message: "No se proporcionó token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    // Lógica principal
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Categoría no encontrada" });

    if (category.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedCategory);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Token inválido" });
    }
    res.status(500).json({ message: error.message });
  }
};