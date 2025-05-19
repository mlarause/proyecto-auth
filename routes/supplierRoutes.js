const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { authenticate, authorize } = require('../middlewares/auth');

// Aplicar autenticación a todas las rutas
router.use(authenticate);

// Endpoints
router.post('/', authorize(['admin', 'coordinador']), supplierController.createSupplier);
router.get('/', authorize(['admin', 'coordinador', 'auxiliar']), supplierController.getSuppliers);
router.get('/:id', authorize(['admin', 'coordinador', 'auxiliar']), supplierController.getSupplierById);
router.put('/:id', authorize(['admin', 'coordinador']), supplierController.updateSupplier);
router.delete('/:id', authorize(['admin']), supplierController.deleteSupplier);
router.get('/product/:productId', authorize(['admin', 'coordinador', 'auxiliar']), supplierController.getSuppliersByProduct);

module.exports = router;