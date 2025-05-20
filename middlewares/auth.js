const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../config/auth.config');
const User = require('../models/User');

// 1. Middleware de verificación de token (versión mejorada)
const verifyToken = (req, res, next) => {
  // Buscar token en: headers, cookies y body (como en tus otros módulos)
  let token = req.headers['x-access-token'] || 
             req.cookies?.token || 
             req.headers['authorization']?.split(' ')[1];

  if (!token) {
    console.error('Token no encontrado. Headers recibidos:', req.headers);
    return res.status(403).json({ 
      success: false, 
      message: 'Token no proporcionado' 
    });
  }

  // Verificar token
  jwt.verify(token, TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      console.error('Error al verificar token:', err.message);
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido o expirado' 
      });
    }

    // Verificar que el usuario aún existe en BD
    try {
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Adjuntar información del usuario al request
      req.userId = decoded.id;
      req.userRole = decoded.role;
      req.user = user; // <- Esto es útil para otras funciones
      
      next();
    } catch (dbError) {
      console.error('Error al buscar usuario:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Error al verificar usuario'
      });
    }
  });
};

// 2. Función isAdmin (original de tu repositorio)
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

// 3. Función isCoordinador (original de tu repositorio)
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

// 4. Función isAuxiliar (original de tu repositorio)
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

// 5. Función checkRole (compatible con tus funciones existentes)
const checkRole = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: `Acceso denegado. Rol requerido: ${allowedRoles.join(', ')}`
        });
      }
      next();
    } catch (error) {
      console.error('Error en checkRole:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al verificar roles'
      });
    }
  };
};

// Exportación manteniendo todas tus funciones originales
module.exports = {
  verifyToken,
  isAdmin,
  isCoordinador,
  isAuxiliar,
  checkRole
};