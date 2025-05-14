const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const User = require('../models/User'); // Una sola importación

// 1. Verificación de Token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  
  if (!token) {
    return res.status(403).json({ 
      success: false,
      message: 'No se proporcionó token' 
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ 
        success: false,
        message: 'Token inválido o expirado' 
      });
    }
    req.userId = decoded.id;
    next();
  });
};

// 2. Verificar Rol Admin
const isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: 'Error al buscar usuario' 
      });
    }

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    if (user.roles.includes('admin')) {
      next();
    } else {
      res.status(403).json({ 
        success: false,
        message: 'Requiere rol de Admin' 
      });
    }
  });
};

// 3. Verificar Rol Coordinador
const isCoordinator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: 'Error al buscar usuario' 
      });
    }

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    if (user.roles.includes('coordinador')) {
      next();
    } else {
      res.status(403).json({ 
        success: false,
        message: 'Requiere rol de Coordinador' 
      });
    }
  });
};

// 4. Verificar Rol Auxiliar
const isAuxiliar = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: 'Error al buscar usuario' 
      });
    }

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    if (user.roles.includes('auxiliar')) {
      next();
    } else {
      res.status(403).json({ 
        success: false,
        message: 'Requiere rol de Auxiliar' 
      });
    }
  });
};

// 5. Verificar Coordinador o Admin (Combinado)
const isCoordinatorOrAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: 'Error al buscar usuario' 
      });
    }

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    if (user.roles.includes('coordinador') || user.roles.includes('admin')) {
      next();
    } else {
      res.status(403).json({ 
        success: false,
        message: 'Requiere rol de Coordinador o Admin' 
      });
    }
  });
};

// Exportación organizada
module.exports = {
  verifyToken,
  isAdmin,
  isCoordinator,
  isAuxiliar,
  isCoordinatorOrAdmin
};