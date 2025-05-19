const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { check } = require('express-validator');

const validateCategory = [
  check('name').not().isEmpty().trim().withMessage('El nombre es obligatorio'),
  check('description').not().isEmpty().trim().withMessage('La descripción es obligatoria')
];

router.post('/', validateCategory, categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', validateCategory, categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;