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

    req.user = user; // Adjuntamos el usuario completo al request
    req.userId = user._id;
    req.userRole = user.role; // Tomamos el rol directamente de la BD
    next();
  } catch (error) {
    console.error('Error al verificar token:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

// 2. Middleware isCoordinador (actualizado según tu estructura)
const isCoordinador = async (req, res, next) => {
  try {
    // Ya tenemos el usuario en req.user gracias a verifyToken
    if (['admin', 'coordinador'].includes(req.user.role)) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Se requiere rol coordinador o admin'
      });
    }
  } catch (error) {
    console.error('Error en isCoordinador:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al verificar rol'
    });
  }
};

// 3. Middleware isAdmin (manteniendo compatibilidad)
const isAdmin = async (req, res, next) => {
  if (req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Se requiere rol admin' 
    });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  isCoordinador
};