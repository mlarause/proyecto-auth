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
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    console.error('Error al verificar token:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

// 2. Función checkRole (versión mejorada - compatible con tus otros módulos)
const checkRole = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      if (requiredRoles.includes(user.role)) {
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: `Se requiere rol: ${requiredRoles.join(' o ')}`
        });
      }
    } catch (error) {
      console.error('Error en checkRole:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al verificar rol'
      });
    }
  };
};

// 3. Funciones específicas (manteniendo compatibilidad)
const isAdmin = checkRole(['admin']);
const isCoordinador = checkRole(['admin', 'coordinador']);
const isAuxiliar = checkRole(['auxiliar', 'coordinador', 'admin']);

module.exports = {
  verifyToken,
  isAdmin,
  isCoordinador,
  isAuxiliar,
  checkRole
};