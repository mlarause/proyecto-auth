const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const authJwt = require('../middlewares/authJwt');
const { checkDuplicateSupplierEmail } = require('../middlewares/verifySupplier');

// Rutas para proveedores
router.post('/',
  [
    authJwt.verifyToken,
    authJwt.isAdmin,
    checkDuplicateSupplierEmail
  ],
  supplierController.createSupplier
);

router.get('/',
  authJwt.verifyToken,
  supplierController.getAllSuppliers
);

router.get('/:id',
  authJwt.verifyToken,
  supplierController.getSupplierById
);

router.put('/:id',
  [
    authJwt.verifyToken,
    authJwt.isAdmin
  ],
  supplierController.updateSupplier
);

router.delete('/:id',
  [
    authJwt.verifyToken,
    authJwt.isAdmin
  ],
  supplierController.deleteSupplier
);

module.exports = router;