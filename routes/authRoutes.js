const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta de registro
router.post('/signup', authController.signup);

// Ruta de inicio de sesión
router.post('/signin', authController.signin);

module.exports = router;