const jwt = require('jsonwebtoken');
const config = require('../config');

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'No se proporcionó token de autenticación'
    });
  }

  const tokenClean = token.startsWith('Bearer ') ? token.slice(7) : token;

  jwt.verify(tokenClean, config.SECRET, (err, decoded) => {
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

const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Se requieren privilegios de administrador'
    });
  }
  next();
};

const isCoordinador = (req, res, next) => {
  if (!['admin', 'coordinador'].includes(req.userRole)) {
    return res.status(403).json({
      success: false,
      message: 'Se requieren privilegios de coordinador o administrador'
    });
  }
  next();
};

module.exports = {
  verifyToken,
  isAdmin,
  isCoordinador
};