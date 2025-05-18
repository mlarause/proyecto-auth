const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { checkRole } = require('../middlewares/role');
const {
  createSupplier,
  getAllSuppliers
} = require('../controllers/suppliercontroller');

// Admin y Coordinador pueden crear
router.post('/', verifyToken, checkRole(['admin', 'coordinador']), createSupplier);

// Todos los roles pueden leer
router.get('/', verifyToken, getAllSuppliers);

module.exports = router;