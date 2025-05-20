const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const User = require('../models/User');

// 1. Función verifyToken (idéntica a la implementación en categorías)
const verifyToken = async (req, res, next) => {
  const token = req.headers['x-access-token'] || 
               req.headers['authorization']?.split(' ')[1] || 
               req.cookies?.token;

  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'Token no proporcionado'
    });
  }

  try {
    const decoded = jwt.verify(token, config.secret);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;
    next();
  } catch (error) {
    console.error('Error al verificar token:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

// 2. Middleware isAdmin (para CRUD completo)
const isAdmin = (req, res, next) => {
  if (req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Se requiere rol admin' 
    });
  }
};

// 3. Middleware isCoordinador (solo crear/consultar/modificar)
const isCoordinador = (req, res, next) => {
  if (['admin', 'coordinador'].includes(req.user.role)) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Se requiere rol coordinador o admin'
    });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  isCoordinador
};