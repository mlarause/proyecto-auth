const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models/User');
const User = db.User;

verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'];
  
  if (!token) {
    return res.status(403).send({ message: 'No se proporcionó token' });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'No autorizado!' });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user.roles.includes('admin')) {
      next();
      return;
    }

    res.status(403).send({ message: 'Requiere rol de Admin!' });
  });
};

isCoordinador = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user.roles.includes('coordinador')) {
      next();
      return;
    }

    res.status(403).send({ message: 'Requiere rol de Coordinador!' });
  });
};

isAuxiliar = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user.roles.includes('auxiliar')) {
      next();
      return;
    }

    res.status(403).send({ message: 'Requiere rol de Auxiliar!' });
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isCoordinador,
  isAuxiliar
};

module.exports = {
  verifyToken,
  isAdmin,
  isCoordinador,
  isAuxiliar
};