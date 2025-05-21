const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { verifyToken, verifyRole } = require('../middlewares/auth');

// Admin only routes
router.post('/', 
    verifyToken, 
    verifyRole(['admin']), 
    supplierController.createSupplier
);

router.delete('/:id', 
    verifyToken, 
    verifyRole(['admin']), 
    supplierController.deleteSupplier
);

// Admin & Coordinator routes
router.put('/:id', 
    verifyToken, 
    verifyRole(['admin', 'coordinator']), 
    supplierController.updateSupplier
);

// All authenticated roles
router.get('/', 
    verifyToken, 
    verifyRole(['admin', 'coordinator', 'assistant']), 
    supplierController.getSuppliers
);

// Supplier token generation (public)
router.post('/token', supplierController.generateSupplierToken);

module.exports = router;