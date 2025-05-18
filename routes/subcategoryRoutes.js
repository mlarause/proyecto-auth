const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { checkRole } = require('../middlewares/role');
const {
  createSubCategory,
  getSubCategoriesByCategory
} = require('../controllers/subcategorycontroller');

// Admin y Coordinador pueden crear
router.post('/', verifyToken, checkRole(['admin', 'coordinador']), createSubCategory);

// Todos los roles pueden leer
router.get('/by-category/:categoryId', verifyToken, getSubCategoriesByCategory);

module.exports = router;