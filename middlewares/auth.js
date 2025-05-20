const jwt = require('jsonwebtoken');
const config = require('../config/auth.config'); // Importación corregida

// 1. Función verifyToken (idéntica a la de categorías)
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || 
               req.cookies?.token ||
               req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ 
      success: false, 
      message: 'Token no proporcionado' 
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => { // Usando config.secret
    if (err) {
      console.error('Error JWT:', err.message);
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

// 2. Función isAdmin (igual a categorías)
const isAdmin = (req, res, next) => {
  if (req.userRole === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Se requiere rol admin' 
    });
  }
};

// 3. Función isCoordinador (igual a categorías)
const isCoordinador = (req, res, next) => {
  if (['admin', 'coordinador'].includes(req.userRole)) {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Se requiere rol coordinador o admin' 
    });
  }
};

// Exportación idéntica a tus otros módulos
module.exports = {
  verifyToken,
  isAdmin,
  isCoordinador
};