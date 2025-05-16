const db = require('../models/User');
const User = db.User;

exports.allAccess = (req, res) => {
  res.status(200).send("Contenido público.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("Contenido de usuario.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Contenido de administrador.");
};

exports.coordinadorBoard = (req, res) => {
  res.status(200).send("Contenido de coordinador.");
};

exports.auxiliarBoard = (req, res) => {
  res.status(200).send("Contenido de auxiliar.");
};

// Asegúrate de exportar las funciones que usas en las rutas:
module.exports = {
  register: async (req, res) => {
    // Lógica de registro...
  },
  login: async (req, res) => {
    // Lógica de login...
  },
  // ... otras funciones si las usas
};