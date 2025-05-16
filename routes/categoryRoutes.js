const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, isAdmin, isCoordinadorOrAdmin } = require('../middlewares/authJwt');

// Admin puede crear
router.post('/', [verifyToken, isAdmin], categoryController.create);

// Todos los usuarios autenticados pueden listar
router.get('/', [verifyToken], categoryController.findAll);

// Todos los usuarios autenticados pueden ver detalles
router.get('/:id', [verifyToken], categoryController.findOne);

// Coordinador y Admin pueden actualizar
router.put('/:id', [verifyToken, isCoordinadorOrAdmin], categoryController.update);

// Solo Admin puede eliminar
router.delete('/:id', [verifyToken, isAdmin], categoryController.delete);

module.exports = router;