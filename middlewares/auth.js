const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (req, res, next) => {
  try {
    // 1. Obtener token del header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Autenticación requerida. Por favor inicie sesión.' 
      });
    }

    // 2. Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Buscar usuario y adjuntar a la solicitud
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Usuario no encontrado. Token inválido.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    
    // Manejar diferentes tipos de errores de JWT
    const message = error.name === 'JsonWebTokenError' 
      ? 'Token inválido' 
      : error.name === 'TokenExpiredError' 
        ? 'Token expirado' 
        : 'Error de autenticación';
    
    res.status(401).json({ 
      success: false,
      message 
    });
  }
};

exports.authorize = (roles = []) => {
  // Convertir a array si se pasa un string
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    // Verificar si el usuario tiene alguno de los roles requeridos
    if (!roles.includes(req.user.role)) {
      console.warn(`Intento de acceso no autorizado. Usuario: ${req.user._id}, Rol: ${req.user.role}, Ruta: ${req.originalUrl}`);
      
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para realizar esta acción',
        requiredRoles: roles,
        currentRole: req.user.role
      });
    }
    next();
  };
};