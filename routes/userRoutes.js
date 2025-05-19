const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authJwt');
const userController = require('../controllers/userController');

// Obtener todos los usuarios (solo admin)
router.get('/', [verifyToken], userController.getAllUsers);

// Obtener un usuario por ID
router.get('/:id', [verifyToken], userController.getUserById);

// Actualizar usuario
router.put('/:id', [verifyToken], userController.updateUser);

// Eliminar usuario (solo admin)
router.delete('/:id', [verifyToken], userController.deleteUser);

module.exports = router;