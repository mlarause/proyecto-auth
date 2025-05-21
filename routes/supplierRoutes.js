const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { verifyToken, verifyRole } = require('../middlewares/auth');

// Admin routes
router.post('/', verifyToken, verifyRole(['admin']), supplierController.createSupplier);
router.delete('/:id', verifyToken, verifyRole(['admin']), supplierController.deleteSupplier);

// Admin and Coordinator routes
router.put('/:id', verifyToken, verifyRole(['admin', 'coordinator']), supplierController.updateSupplier);

// Admin, Coordinator and Assistant routes
router.get('/', verifyToken, verifyRole(['admin', 'coordinator', 'assistant']), supplierController.getAllSuppliers);
router.get('/:id', verifyToken, verifyRole(['admin', 'coordinator', 'assistant']), supplierController.getSupplierById);

// Supplier token generation (public route)
router.post('/token', supplierController.generateSupplierToken);

module.exports = router;