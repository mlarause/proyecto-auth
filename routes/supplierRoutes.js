const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { verifyToken, isAdmin } = require('../middlewares/authJwt');

router.post('/', verifyToken, isAdmin, supplierController.createSupplier);
router.get('/', supplierController.getAllSuppliers);
router.get('/:id', supplierController.getSupplierById);
router.put('/:id', verifyToken, isAdmin, supplierController.updateSupplier);
router.delete('/:id', verifyToken, isAdmin, supplierController.deleteSupplier);

module.exports = router;