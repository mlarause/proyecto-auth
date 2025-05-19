const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../config/auth.config');
const User = require('../models/User');

// 1. Función original verifyToken (mejorada para manejar más casos)
const verifyToken = (req, res, next) => {
  // Buscar token en: headers, cookies o body
  const token = req.headers['x-access-token'] || 
               req.cookies?.token || 
               req.body?.token;

  if (!token) {
    return res.status(403).json({ 
      success: false,
      message: 'Token no proporcionado' 
    });
  }

  jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error('Error al verificar token:', err);
      return res.status(401).json({ 
        success: false,
        message: 'Token inválido o expirado' 
      });
    }

    // Asignar datos del usuario a la petición
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

// 2. Función original isAdmin
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
    console.error('Error en isAdmin:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al verificar rol'
    });
  }
};

// 3. Función original isCoordinador
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
    console.error('Error en isCoordinador:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al verificar rol'
    });
  }
};

// 4. Función original isAuxiliar
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
    console.error('Error en isAuxiliar:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al verificar rol'
    });
  }
};

// 5. Función original checkRole (si la tenías)
const checkRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado. Rol requerido: ${allowedRoles.join(', ')}`
      });
    }
    next();
  };
};

// Exporta TODAS las funciones como las tenías originalmente
module.exports = {
  verifyToken,
  isAdmin,
  isCoordinador,
  isAuxiliar,
  checkRole // Solo si la usabas anteriormente
};