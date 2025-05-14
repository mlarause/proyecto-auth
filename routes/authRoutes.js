const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Registro
router.post('/signup', 
  authController.signup // Asegúrate que sea una función exportada
);

// Login
router.post('/signin', 
  authController.signin // Asegúrate que sea una función exportada
);

module.exports = router;