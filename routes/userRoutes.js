const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/auth');

// Obtener todos los usuarios (admin)
router.get('/', verifyToken, userController.getAllUsers);

// Obtener usuario por ID
router.get('/:id', verifyToken, userController.getUserById);

// Crear usuario (admin)
router.post('/', verifyToken, userController.createUser);

// Actualizar usuario
router.put('/:id', verifyToken, userController.updateUser);

// Eliminar usuario (admin)
router.delete('/:id', verifyToken, userController.deleteUser);

// Cambiar contraseña
router.post('/:id/change-password', verifyToken, userController.changePassword);

module.exports = router;