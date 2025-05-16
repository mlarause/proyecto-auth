const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, isAdmin, isCoordinadorOrAdmin } = require('../middlewares/authJwt');

// Crear producto (Solo admin)
router.post('/', [verifyToken, isAdmin], productController.create);

// Obtener todos los productos (Todos los roles autenticados)
router.get('/', [verifyToken], productController.findAll);

// Obtener un producto específico
router.get('/:id', [verifyToken], productController.findOne);

// Actualizar producto (Admin y coordinador)
router.put('/:id', [verifyToken, isCoordinadorOrAdmin], productController.update);

// Eliminar producto (Solo admin)
router.delete('/:id', [verifyToken, isAdmin], productController.delete);

module.exports = router;