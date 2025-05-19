const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const authMiddleware = require('../middlewares/auth'); // Importación corregida

// CREATE - Admin y Coordinador
router.post('/',
  authMiddleware.verifyToken, // Usar authMiddleware.verifyToken
  authMiddleware.checkRole(['admin', 'coordinador']),
  supplierController.createSupplier
);

// READ ALL - Todos autenticados
router.get('/',
  authMiddleware.verifyToken,
  supplierController.getAllSuppliers
);

// READ ONE - Todos autenticados
router.get('/:id',
  authMiddleware.verifyToken,
  supplierController.getSupplierById
);

// UPDATE - Admin y Coordinador
router.put('/:id',
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin', 'coordinador']),
  supplierController.updateSupplier
);

// DELETE - Solo Admin
router.delete('/:id',
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  supplierController.deleteSupplier
);

module.exports = router;