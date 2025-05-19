const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../config/auth.config');

// 1. Middleware de verificación de token (idéntico al de categorías)
const verifyToken = (req, res, next) => {
  // Buscar token en headers, cookies y body (como en tus otros módulos)
  const token = req.headers['x-access-token'] || 
               req.cookies?.token || 
               req.body?.token;

  if (!token) {
    console.error('Token no encontrado en:', {
      headers: req.headers,
      cookies: req.cookies,
      body: req.body
    });
    return res.status(403).json({ 
      success: false, 
      message: 'Token no proporcionado' 
    });
  }

  // Verificar token
  jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error('Error al verificar token:', err);
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido o expirado' 
      });
    }
    
    // Asignar datos del usuario (igual que en categorías)
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

// 2. Middleware de roles (conservando tus funciones originales)
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
  if (['admin', 'coordinador', 'auxiliar'].includes(req.userRole)) {
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