const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  
  if (!token) {
    return res.status(403).json({ message: 'No se proporcionó token' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'No autorizado' });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user.rol === 'admin') {
      return next();
    }
    res.status(403).json({ message: 'Requiere rol de administrador' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const isCoordinadorOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user.rol === 'coordinador' || user.rol === 'admin') {
      return next();
    }
    res.status(403).json({ message: 'Requiere rol de coordinador o administrador' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  isCoordinadorOrAdmin
};