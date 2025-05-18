const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { checkRole } = require('../middlewares/role');
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
} = require('../controllers/category.controller');

// Admin y Coordinador pueden crear/modificar/eliminar
router.post('/', verifyToken, checkRole(['admin', 'coordinador']), createCategory);
router.put('/:id', verifyToken, checkRole(['admin', 'coordinador']), updateCategory);
router.delete('/:id', verifyToken, checkRole(['admin']), deleteCategory);

// Todos los roles pueden leer
router.get('/', verifyToken, getAllCategories);

module.exports = router;