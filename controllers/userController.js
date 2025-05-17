const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Actualizar usuario
exports.updateUser = async (req, res) => {
  try {
    // Verificación de token
    const token = req.headers['x-access-token'] || req.body.token;
    if (!token) return res.status(403).json({ message: "No se proporcionó token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    // Lógica principal
    if (req.params.id !== req.userId) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Token inválido" });
    }
    res.status(500).json({ message: error.message });
  }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
  try {
    // Verificación de token
    const token = req.headers['x-access-token'] || req.body.token;
    if (!token) return res.status(403).json({ message: "No se proporcionó token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    // Lógica principal
    if (req.params.id !== req.userId) {
      return res.status(403).json({ message: "No autorizado" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Token inválido" });
    }
    res.status(500).json({ message: error.message });
  }
};