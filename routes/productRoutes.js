const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, isAdmin, isCoordinadorOrAdmin } = require('../middlewares/authJwt');

router.post('/', [verifyToken, isAdmin], productController.create);
router.get('/', [verifyToken], productController.findAll);
router.get('/:id', [verifyToken], productController.findOne);
router.put('/:id', [verifyToken, isCoordinadorOrAdmin], productController.update);
router.delete('/:id', [verifyToken, isAdmin], productController.delete);

module.exports = router;