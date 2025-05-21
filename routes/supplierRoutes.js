const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { verifyToken, verifyRole } = require('../middlewares/auth'); // Ruta corregida

// Admin routes
router.post('/', 
    verifyToken, 
    verifyRole(['admin']), 
    supplierController.createSupplier
);

// Admin & coordiandor routes
router.put('/:id', 
    verifyToken, 
    verifyRole(['admin', 'coordinador']), 
    supplierController.updateSupplier
);

// All roles routes
router.get('/', 
    verifyToken, 
    verifyRole(['admin', 'coordinador', 'auxiliar']), 
    supplierController.getAllSuppliers
);

router.get('/:id', 
    verifyToken, 
    verifyRole(['admin', 'coordinador', 'auxiliar']), 
    supplierController.getSupplierById
);

// Admin only
router.delete('/:id', 
    verifyToken, 
    verifyRole(['admin']), 
    supplierController.deleteSupplier
);

// Public route for token generation
router.post('/token', supplierController.generateSupplierToken);

module.exports = router;