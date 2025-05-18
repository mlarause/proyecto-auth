const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { checkRole } = require('../middlewares/role');
const {
  createProduct,
  getProductsBySubCategory
} = require('../controllers/product.controller');

// Admin y Coordinador pueden crear
router.post('/', verifyToken, checkRole(['admin', 'coordinador']), createProduct);

// Todos los roles pueden leer
router.get('/by-subcategory/:subcategoryId', verifyToken, getProductsBySubCategory);

module.exports = router;