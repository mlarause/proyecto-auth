const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/authJwt');
const categoryController = require('../controllers/categoryController');

// Rutas para categorías
router.post('/', [verifyToken, isAdmin], categoryController.create);
router.get('/', verifyToken, categoryController.getAll);
router.get('/:id', verifyToken, categoryController.getById);
router.put('/:id', [verifyToken, isAdmin], categoryController.update);
router.delete('/:id', [verifyToken, isAdmin], categoryController.delete);

module.exports = router;