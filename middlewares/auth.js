const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../config/auth.config');

// Función verifyToken (idéntica a la de categorías)
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.cookies.token;
  
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

// Funciones de roles (iguales a las de categorías)
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

module.exports = {
  verifyToken,
  isAdmin,
  isCoordinador
};