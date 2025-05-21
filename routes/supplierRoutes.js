const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const authJwt = require('../middlewares/authJwt');

// Middleware de verificación mejorado
const verifySupplierToken = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(403).json({ 
                success: false,
                message: "No se proporcionó token" 
            });
        }

        const decoded = jwt.verify(token, config.secret);
        const user = await db.User.findById(decoded.id).exec();
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "Usuario no encontrado" 
            });
        }

        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token inválido",
            error: error.message
        });
    }
};

// Rutas para proveedores
router.post('/', 
    verifySupplierToken,
    authJwt.isAdmin,
    supplierController.createSupplier
);

router.get('/', 
    verifySupplierToken,
    supplierController.getAllSuppliers
);

router.get('/:id', 
    verifySupplierToken,
    supplierController.getSupplierById
);

router.put('/:id', 
    verifySupplierToken,
    authJwt.isAdmin,
    supplierController.updateSupplier
);

router.delete('/:id', 
    verifySupplierToken,
    authJwt.isAdmin,
    supplierController.deleteSupplier
);

module.exports = router;