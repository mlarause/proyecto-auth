const express = require('express');
const router = express.Router();
const {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController'); // Importación explícita

const { verifyToken, checkRole, isAdmin } = require('../middlewares/auth');

// Ruta POST - Crear proveedor
router.post('/',
  verifyToken,
  checkRole(['admin', 'coordinador']),
  createSupplier
);

// Ruta GET - Todos los proveedores
router.get('/',
  verifyToken,
  getAllSuppliers
);

// Ruta GET - Proveedor por ID
router.get('/:id',
  verifyToken,
  getSupplierById
);

// Ruta PUT - Actualizar proveedor
router.put('/:id',
  verifyToken,
  checkRole(['admin', 'coordinador']),
  updateSupplier
);

// Ruta DELETE - Eliminar proveedor
router.delete('/:id',
  verifyToken,
  isAdmin,
  deleteSupplier
);

module.exports = router;