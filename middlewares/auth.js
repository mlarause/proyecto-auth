const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

// Función existente verifyToken (no la modifiques si ya funciona)
const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.cookies.token;
  
  if (!token) {
    return res.status(403).json({ message: "Token no proporcionado" });
  }

  jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido" });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

// Función existente isAdmin (si la tienes)
const isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      return res.status(500).json({ message: err });
    }

    if (user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "Requiere rol de Admin" });
    }
  });
};

// Función existente isModerator (si la tienes)
const isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      return res.status(500).json({ message: err });
    }

    if (user.role === "moderator") {
      next();
    } else {
      return res.status(403).json({ message: "Requiere rol de Moderador" });
    }
  });
};

// Nueva función para validar roles dinámicos (sin borrar lo existente)
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado. Rol requerido: ${allowedRoles.join(", ")}`
      });
    }
    next();
  };
};

// Exporta TODAS las funciones (las tuyas + la nueva)
module.exports = {
  verifyToken,
  isAdmin,
  isModerator,
  checkRole
};