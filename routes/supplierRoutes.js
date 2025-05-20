const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { verifyToken, isAdmin, isCoordinator } = require('../middlewares/authJwt');

// Aplicar verifyToken a todas las rutas
router.use(verifyToken);

// Admin: CRUD completo
router.post('/', isAdmin, supplierController.create);
router.put('/:id', isAdmin, supplierController.update);
router.delete('/:id', isAdmin, supplierController.delete);

// Coordinador: Actualización limitada
router.patch('/:id', isCoordinator, supplierController.partialUpdate);

// Todos autenticados: Consultas
router.get('/', supplierController.findAll);
router.get('/:id', supplierController.findOne);

module.exports = router;