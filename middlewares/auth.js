const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../config/auth.config');

// 1. Función verifyToken (mejorada)
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || 
               req.headers['authorization']?.split(' ')[1] || 
               req.cookies?.token;

  if (!token) {
    return res.status(403).json({ 
      success: false, 
      message: 'Token no proporcionado' 
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

// 2. Función isAdmin (añadida)
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

// 3. Función isCoordinador (añadida)
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

// 4. Función isAuxiliar (añadida)
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

// Exportar todas las funciones
module.exports = {
  verifyToken,
  isAdmin,
  isCoordinador,
  isAuxiliar
};