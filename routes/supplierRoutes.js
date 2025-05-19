// routes/supplierRoutes.js
const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { verifyToken, isAdmin, isCoordinador } = require('../middlewares/auth');

router.post('/', verifyToken, isCoordinador, supplierController.createSupplier);
router.get('/', verifyToken, supplierController.getAllSuppliers);
router.get('/:id', verifyToken, supplierController.getSupplierById);
router.put('/:id', verifyToken, isCoordinador, supplierController.updateSupplier);
router.delete('/:id', verifyToken, isAdmin, supplierController.deleteSupplier);
router.get('/search/:query', verifyToken, supplierController.searchSuppliers);

module.exports = router;