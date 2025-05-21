const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { verifyToken, verifyRole } = require('../../middlewares/auth'); // Adjusted path

// Admin routes
router.post('/', 
    verifyToken, 
    verifyRole(['admin']), 
    supplierController.createSupplier
);

// Admin & Coordinator routes
router.put('/:id', 
    verifyToken, 
    verifyRole(['admin', 'coordinator']), 
    supplierController.updateSupplier
);

// All roles routes
router.get('/', 
    verifyToken, 
    verifyRole(['admin', 'coordinator', 'auxiliar']), 
    supplierController.getSuppliers
);

// Public route for token generation
router.post('/token', supplierController.generateSupplierToken);

module.exports = router;