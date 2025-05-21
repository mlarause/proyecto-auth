const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const authJwt = require('../middlewares/authJwt');

// Ruta POST corregida para crear proveedor
router.post('/', 
    authJwt.verifyToken, 
    async (req, res, next) => {
        try {
            // Verificación de usuario usando Mongoose
            const user = await require('../models/User').findById(req.userId);
            if (!user) {
                return res.status(403).json({ 
                    success: false,
                    message: "No autorizado" 
                });
            }
            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error de autenticación"
            });
        }
    },
    authJwt.isAdmin,
    supplierController.createSupplier
);

// Obtener todos los proveedores
router.get('/', 
    authJwt.verifyToken,
    supplierController.getAllSuppliers
);

// Obtener un proveedor por ID
router.get('/:id', 
    authJwt.verifyToken,
    supplierController.getSupplierById
);

// Actualizar proveedor
router.put('/:id', 
    authJwt.verifyToken,
    authJwt.isAdmin,
    supplierController.updateSupplier
);

// Eliminar proveedor
router.delete('/:id', 
    authJwt.verifyToken,
    authJwt.isAdmin,
    supplierController.deleteSupplier
);

module.exports = router;