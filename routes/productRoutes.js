const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, isAdmin, isCoordinator } = require('../middlewares/authJwt');

// Solo Admin puede crear
router.post('/', 
  [verifyToken, isAdmin], 
  productController.createProduct
);

// Todos los roles pueden listar
router.get('/', 
  verifyToken, 
  productController.getProducts
);

// Admin y Coordinador pueden actualizar
router.put('/:id', 
  [verifyToken, isAdmin || isCoordinator], 
  productController.updateProduct
);

// Solo Admin puede eliminar
router.delete('/:id', 
  [verifyToken, isAdmin], 
  productController.deleteProduct
);

module.exports = router;