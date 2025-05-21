const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const authJwt = require('../middlewares/authJwt');

// Rutas para proveedores
router.post('/', [authJwt.verifyToken, authJwt.isAdmin], supplierController.create);
router.get('/', [authJwt.verifyToken], supplierController.findAll);
router.get('/:id', [authJwt.verifyToken], supplierController.findOne);
router.put('/:id', [authJwt.verifyToken, authJwt.isAdmin], supplierController.update);
router.delete('/:id', [authJwt.verifyToken, authJwt.isAdmin], supplierController.delete);

module.exports = router;