const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { verifyToken, isAdmin, isCoordinator } = require('../middlewares/authJwt');

// Todas las rutas requieren token
router.use(verifyToken);

// Admin: CRUD completo
router.post('/', isAdmin, supplierController.create);
router.put('/:id', isAdmin, supplierController.update);
router.delete('/:id', isAdmin, supplierController.delete);

// Coordinador: Actualización parcial
router.patch('/:id', isCoordinator, supplierController.partialUpdate);

// Todos pueden consultar
router.get('/', supplierController.findAll);
router.get('/:id', supplierController.findOne);

module.exports = router;