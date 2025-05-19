const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { verifyToken, isAdmin, isCoordinador } = require('../middlewares/auth');

// CREATE - Admin y Coordinador (igual que en categorías)
router.post('/',
  verifyToken,
  isCoordinador,
  supplierController.createSupplier
);

// READ ALL - Todos autenticados
router.get('/',
  verifyToken,
  supplierController.getAllSuppliers
);

// READ ONE - Todos autenticados
router.get('/:id',
  verifyToken,
  supplierController.getSupplierById
);

// UPDATE - Admin y Coordinador
router.put('/:id',
  verifyToken,
  isCoordinador,
  supplierController.updateSupplier
);

// DELETE - Solo Admin
router.delete('/:id',
  verifyToken,
  isAdmin,
  supplierController.deleteSupplier
);

module.exports = router;