const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { verifyToken, isAdmin, isCoordinator } = require('../middlewares/authJwt');
const { check } = require('express-validator');

// Rutas para Proveedores
router.post('/', 
    [
        verifyToken,
        isAdmin,
        check('name', 'El nombre es requerido').notEmpty(),
        check('products', 'Debe asociar al menos un producto').notEmpty()
    ], 
    supplierController.createSupplier
);

router.get('/', 
    verifyToken, 
    supplierController.getAllSuppliers
);

router.get('/:id', 
    [
        verifyToken,
        check('id', 'ID inválido').isUUID()
    ],
    supplierController.getSupplierById
);

router.put('/:id',
    [
        verifyToken,
        isAdmin,
        check('id', 'ID inválido').isUUID()
    ],
    supplierController.updateSupplier
);

router.delete('/:id',
    [
        verifyToken,
        isAdmin,
        check('id', 'ID inválido').isUUID()
    ],
    supplierController.deleteSupplier
);

// Ruta para coordinadores
router.patch('/:id',
    [
        verifyToken,
        isCoordinator,
        check('id', 'ID inválido').isUUID()
    ],
    supplierController.partialUpdateSupplier
);

module.exports = router;