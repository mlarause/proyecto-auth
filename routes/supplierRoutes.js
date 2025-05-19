const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const auth = require('../middlewares/auth');

// CREATE - Solo admin y coordinador
router.post('/',
  auth.verifyToken,
  auth.checkRole(['admin', 'coordinador']),
  supplierController.createSupplier
);

// READ ALL - Todos autenticados
router.get('/',
  auth.verifyToken,
  supplierController.getAllSuppliers
);

// READ ONE - Todos autenticados
router.get('/:id',
  auth.verifyToken,
  supplierController.getSupplierById
);

// UPDATE - Solo admin y coordinador
router.put('/:id',
  auth.verifyToken,
  auth.checkRole(['admin', 'coordinador']),
  supplierController.updateSupplier
);

// DELETE - Solo admin
router.delete('/:id',
  auth.verifyToken,
  auth.isAdmin,
  supplierController.deleteSupplier
);

module.exports = router;