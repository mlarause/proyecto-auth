const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

// Rutas de proveedores
router.get('/', supplierController.getAllSuppliers);
router.post('/', supplierController.createSupplier);

module.exports = router;