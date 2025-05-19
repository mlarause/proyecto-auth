const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { authenticate, authorize } = require('../middlewares/auth');
const { check } = require('express-validator');

// Validaciones
const validateSupplier = [
  check('name').not().isEmpty().withMessage('El nombre es obligatorio'),
  check('contact').not().isEmpty().withMessage('El contacto es obligatorio'),
  check('email').isEmail().withMessage('Email inválido'),
  check('products').isArray({ min: 1 }).withMessage('Debe tener al menos un producto'),
  check('products.*').isMongoId().withMessage('IDs de producto inválidos')
];

// Middlewares de autenticación para todas las rutas
router.use(authenticate);
router.use(authorize('admin'));

// Rutas
router.post('/', validateSupplier, supplierController.createSupplier);
router.get('/', supplierController.getSuppliers);
router.get('/:id', supplierController.getSupplierById);
router.put('/:id', validateSupplier, supplierController.updateSupplier);
router.delete('/:id', supplierController.deleteSupplier);
router.get('/product/:productId', supplierController.getSuppliersByProduct);

module.exports = router;