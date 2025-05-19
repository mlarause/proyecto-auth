const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const categoryController = require('../controllers/categoryController');

// Middleware de validación
const validateCategory = [
  check('name').not().isEmpty().withMessage('El nombre es obligatorio'),
  check('description').not().isEmpty().withMessage('La descripción es obligatoria')
];

// Rutas
router.post('/', validateCategory, categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', validateCategory, categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;