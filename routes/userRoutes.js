const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rutas de autenticación
router.post('/register', userController.register);
router.post('/login', userController.login);

// Rutas CRUD
router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;