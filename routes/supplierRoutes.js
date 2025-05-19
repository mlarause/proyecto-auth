const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { authenticate, authorize } = require('../middlewares/auth');
const { check } = require('express-validator');

// Validaciones comunes
const validateSupplier = [
  check('name').not().isEmpty().trim().withMessage('El nombre del proveedor es obligatorio'),
  check('contact').not().isEmpty().trim().withMessage('El contacto es obligatorio'),
  check('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  check('phone').optional().isMobilePhone().withMessage('Teléfono inválido'),
  check('address').optional().trim(),
  check('products')
    .isArray({ min: 1 }).withMessage('Debe asociar al menos un producto')
    .custom(async (products) => {
      const count = await Product.countDocuments({ _id: { $in: products } });
      if (count !== products.length) {
        throw new Error('Uno o más productos no existen');
      }
    })
];

// Aplicar autenticación a todas las rutas
router.use(authenticate);

// Endpoints
router.post('/', 
  authorize(['admin', 'supplier_manager']), 
  validateSupplier, 
  supplierController.createSupplier
);

router.get('/', 
  authorize(['admin', 'supplier_manager', 'user']), 
  supplierController.getSuppliers
);

router.get('/:id', 
  authorize(['admin', 'supplier_manager', 'user']), 
  supplierController.getSupplierById
);

router.put('/:id', 
  authorize(['admin', 'supplier_manager']), 
  validateSupplier, 
  supplierController.updateSupplier
);

router.delete('/:id', 
  authorize(['admin']), 
  supplierController.deleteSupplier
);

// Proveedores por producto
router.get('/product/:productId', 
  authorize(['admin', 'supplier_manager', 'user']), 
  supplierController.getSuppliersByProduct
);

module.exports = router;