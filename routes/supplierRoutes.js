const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const auth = require('../middlewares/auth');

// ==================== RUTAS DE PROVEEDORES ====================

// [POST] Crear nuevo proveedor - Admin y Coordinador
router.post(
  '/',
  auth.verifyToken,
  auth.checkRole(['admin', 'coordinador']),
  supplierController.createSupplier // Asegúrate que esta función exista en tu controlador
);

// [GET] Obtener todos los proveedores - Todos los roles autenticados
router.get(
  '/',
  auth.verifyToken,
  supplierController.getAllSuppliers // Asegúrate que esta función exista
);

// [GET] Obtener proveedor por ID - Todos los roles autenticados
router.get(
  '/:id',
  auth.verifyToken,
  supplierController.getSupplierById // Asegúrate que esta función exista
);

// [PUT] Actualizar proveedor - Admin y Coordinador
router.put(
  '/:id',
  auth.verifyToken,
  auth.checkRole(['admin', 'coordinador']),
  supplierController.updateSupplier // Asegúrate que esta función exista
);

// [DELETE] Eliminar proveedor - Solo Admin
router.delete(
  '/:id',
  auth.verifyToken,
  auth.isAdmin,
  supplierController.deleteSupplier // Asegúrate que esta función exista
);

module.exports = router;