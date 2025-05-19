const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { authenticate, authorize } = require('../middlewares/auth');

// Todas las rutas requieren autenticación
router.use(authenticate);

// Endpoints específicos (SOLO MODIFICADO PARA PROVEEDORES)
router.post('/', authorize(['admin', 'coordinador']), supplierController.createSupplier);
router.get('/', authorize(['admin', 'coordinador', 'auxiliar']), supplierController.getSuppliers);
router.get('/:id', authorize(['admin', 'coordinador', 'auxiliar']), supplierController.getSupplierById);
router.put('/:id', authorize(['admin', 'coordinador']), supplierController.updateSupplier);
router.delete('/:id', authorize(['admin']), supplierController.deleteSupplier);

module.exports = router;