const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const auth = require('../middlewares/authJwt');

// Configuración específica para suppliers
router.use(auth.verifyToken); // Aplicar a todas las rutas

// Admin: CRUD completo
router.post('/', auth.isAdmin, supplierController.create);
router.put('/:id', auth.isAdmin, supplierController.update);
router.delete('/:id', auth.isAdmin, supplierController.delete);

// Coordinador: Actualización limitada
router.patch('/:id', auth.isCoordinator, supplierController.partialUpdate);

// Todos pueden consultar
router.get('/', supplierController.findAll);
router.get('/:id', supplierController.findOne);

module.exports = router;