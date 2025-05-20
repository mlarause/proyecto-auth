const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { verifyToken, isAdmin, isCoordinator } = require('../middlewares/authJwt');

// Admin: Crear, actualizar, eliminar
router.post('/', [verifyToken, isAdmin], supplierController.create);
router.put('/:id', [verifyToken, isAdmin], supplierController.update);
router.delete('/:id', [verifyToken, isAdmin], supplierController.delete);

// Coordinador: Actualizar
router.patch('/:id', [verifyToken, isCoordinator], supplierController.partialUpdate);

// Todos autenticados: Consultar
router.get('/', verifyToken, supplierController.findAll);
router.get('/:id', verifyToken, supplierController.findOne);

module.exports = router;