const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const User = require('../models/User');

exports.verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  
  if (!token) return res.status(403).json({ message: "No se proporcionó token" });

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(401).json({ message: "No autorizado" });
    req.userId = decoded.id;
    next();
  });
};

exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user.rol === 'admin') return next();
    res.status(403).json({ message: "Requiere rol de administrador" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.isCoordinador = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user.rol === 'coordinador' || user.rol === 'admin') return next();
    res.status(403).json({ message: "Requiere rol de coordinador o admin" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};