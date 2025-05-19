const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../config/auth.config');
const User = require('../models/User');

// 1. Función para verificar token (existente)
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.cookies.token;

  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'No se proporcionó token'
    });
  }

  jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
    
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

// 2. Función para verificar rol de administrador (existente)
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Se requiere rol de administrador'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 3. Función para verificar rol de coordinador (existente)
const isCoordinador = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (user.role === 'coordinador' || user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Se requiere rol de coordinador o administrador'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 4. Función para verificar rol de auxiliar (existente)
const isAuxiliar = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (['auxiliar', 'coordinador', 'admin'].includes(user.role)) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Se requiere rol de auxiliar, coordinador o administrador'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 5. Middleware para validación de roles dinámicos (nuevo - compatible)
const checkRole = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      if (allowedRoles.includes(user.role)) {
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: `Rol no autorizado. Se requiere: ${allowedRoles.join(', ')}`
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
};

// Exporta TODAS las funciones
module.exports = {
  verifyToken,
  isAdmin,
  isCoordinador,
  isAuxiliar,
  checkRole
};