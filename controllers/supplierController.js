const Supplier = require('../models/Supplier');
const jwt = require('jsonwebtoken');

// Crear proveedor
exports.createSupplier = async (req, res) => {
  try {
    // Verificación de token
    const token = req.headers['x-access-token'] || req.body.token;
    if (!token) return res.status(403).json({ message: "No se proporcionó token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    // Lógica principal
    const newSupplier = new Supplier({
      ...req.body,
      createdBy: req.userId
    });

    await newSupplier.save();
    res.status(201).json(newSupplier);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Token inválido" });
    }
    res.status(500).json({ message: error.message });
  }
};

// Actualizar proveedor
exports.updateSupplier = async (req, res) => {
  try {
    // Verificación de token
    const token = req.headers['x-access-token'] || req.body.token;
    if (!token) return res.status(403).json({ message: "No se proporcionó token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    // Lógica principal
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: "Proveedor no encontrado" });

    if (supplier.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedSupplier);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Token inválido" });
    }
    res.status(500).json({ message: error.message });
  }
};