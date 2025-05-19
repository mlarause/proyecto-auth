const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../config/auth.config');

// 1. Función verifyToken
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.cookies?.token;
  
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

// 2. Función checkRole
const checkRole = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ 
        success: false, 
        message: `Acceso denegado. Rol requerido: ${roles.join(', ')}` 
      });
    }
    next();
  };
};

// 3. Función isAdmin
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

// Exportar como objeto
module.exports = {
  verifyToken,
  checkRole,
  isAdmin
};