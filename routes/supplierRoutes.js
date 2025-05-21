const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const authJwt = require('../middlewares/authJwt');

// Ruta POST corregida para crear proveedor
router.post('/api/suppliers', 
    [
        authJwt.verifyToken,
        authJwt.isAdmin
    ],
    async (req, res, next) => {
        try {
            // Verificar si el usuario existe usando Mongoose
            const user = await require('../models/User').findById(req.userId);
            if (!user) {
                return res.status(404).json({ 
                    success: false,
                    message: "Usuario no encontrado" 
                });
            }
            
            // Pasar al controlador
            await supplierController.createSupplier(req, res, next);
        } catch (error) {
            console.error("Error en middleware de supplier:", error);
            res.status(500).json({
                success: false,
                message: "Error al verificar usuario",
                error: error.message
            });
        }
    }
);

// Mantener las demás rutas exactamente como están
router.get('/', authJwt.verifyToken, supplierController.getAllSuppliers);
router.get('/:id', authJwt.verifyToken, supplierController.getSupplierById);
router.put('/:id', [authJwt.verifyToken, authJwt.isAdmin], supplierController.updateSupplier);
router.delete('/:id', [authJwt.verifyToken, authJwt.isAdmin], supplierController.deleteSupplier);

module.exports = router;