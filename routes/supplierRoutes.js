const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { authenticate, authorize } = require('../middlewares/auth');
const { check } = require('express-validator');

const validateSupplier = [
  check('name').not().isEmpty().withMessage('El nombre es obligatorio'),
  check('contact').not().isEmpty().withMessage('El contacto es obligatorio'),
  check('email').isEmail().withMessage('Email inválido'),
  check('products').isArray({ min: 1 }).withMessage('Debe asociar al menos un producto'),
  check('products.*').isMongoId().withMessage('ID de producto inválido')
];

// Aplicar autenticación a todas las rutas
router.use(authenticate);

// Rutas con autorización específica
router.post('/', authorize(['admin', 'supplier_manager']), validateSupplier, supplierController.createSupplier);
router.get('/', authorize(['admin', 'supplier_manager', 'user']), supplierController.getSuppliers);
router.get('/:id', authorize(['admin', 'supplier_manager', 'user']), supplierController.getSupplierById);
router.put('/:id', authorize(['admin', 'supplier_manager']), validateSupplier, supplierController.updateSupplier);
router.delete('/:id', authorize(['admin']), supplierController.deleteSupplier);

module.exports = router;