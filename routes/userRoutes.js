const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/authJwt');
const userController = require('../controllers/userController');

// Ruta GET /api/users
router.get('/', [verifyToken, isAdmin], userController.getAllUsers);

// Ruta GET /api/users/:id
router.get('/:id', verifyToken, userController.getUserById);

// Ruta PUT /api/users/:id
router.put('/:id', verifyToken, userController.updateUser);

// Ruta DELETE /api/users/:id
router.delete('/:id', [verifyToken, isAdmin], userController.deleteUser);

module.exports = router;