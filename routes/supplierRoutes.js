const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { verifyToken, isAdmin, isCoordinator } = require('../middlewares/authJwt');

// Admin: CRUD completo
router.post('/', [verifyToken, isAdmin], supplierController.create);
router.put('/:id', [verifyToken, isAdmin], supplierController.update);
router.delete('/:id', [verifyToken, isAdmin], supplierController.delete);

// Coordinador: Actualización limitada
router.patch('/:id', [verifyToken, isCoordinator], supplierController.partialUpdate);

// Todos los usuarios autenticados: Consultas
router.get('/', verifyToken, supplierController.findAll);
router.get('/:id', verifyToken, supplierController.findOne);

module.exports = router;