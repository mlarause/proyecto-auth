const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../config/auth.config');

// 1. Función verifyToken (idéntica a la de categorías)
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || 
               req.cookies?.token || 
               req.headers['authorization']?.split(' ')[1];

  if (!token) {
    console.error('Token no encontrado en:', {
      headers: req.headers,
      cookies: req.cookies
    });
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
    
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

// 2. Funciones de roles (iguales a las de categorías)
const isAdmin = (req, res, next) => {
  if (req.userRole === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Se requiere rol de administrador' 
    });
  }
};

const isCoordinador = (req, res, next) => {
  if (['admin', 'coordinador'].includes(req.userRole)) {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Se requiere rol de coordinador o administrador' 
    });
  }
};

const isAuxiliar = (req, res, next) => {
  if (['auxiliar', 'coordinador', 'admin'].includes(req.userRole)) {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Se requiere rol de auxiliar, coordinador o administrador' 
    });
  }
};

// Exportación idéntica a tus otros módulos
module.exports = {
  verifyToken,
  isAdmin,
  isCoordinador,
  isAuxiliar
};