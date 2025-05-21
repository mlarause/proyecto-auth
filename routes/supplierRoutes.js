const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const authJwt = require('../middlewares/authJwt');

// Middleware para verificar contenido JSON
const validateJson = (req, res, next) => {
  if (!req.is('application/json')) {
    return res.status(415).json({
      success: false,
      message: 'Se requiere Content-Type: application/json'
    });
  }
  next();
};

// Rutas para proveedores
router.post('/', 
  validateJson,
  authJwt.verifyToken,
  authJwt.isAdmin,
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
  validateJson,
  authJwt.verifyToken,
  authJwt.isAdmin,
  supplierController.updateSupplier
);

router.delete('/:id', 
  authJwt.verifyToken,
  authJwt.isAdmin,
  supplierController.deleteSupplier
);

module.exports = router;