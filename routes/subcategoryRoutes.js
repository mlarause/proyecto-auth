const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subcategoryController');
const { verifyToken, isAdmin } = require('../middlewares/authJwt');

router.post('/', verifyToken, isAdmin, subcategoryController.createSubcategory);
router.get('/', subcategoryController.getAllSubcategories);
router.get('/:id', subcategoryController.getSubcategoryById);
router.put('/:id', verifyToken, isAdmin, subcategoryController.updateSubcategory);
router.delete('/:id', verifyToken, isAdmin, subcategoryController.deleteSubcategory);

module.exports = router;