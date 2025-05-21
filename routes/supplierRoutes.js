const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('../config/auth.config');
const supplierController = require('../controllers/supplierController');
const { body, validationResult } = require('express-validator');

// Importar modelos directamente para evitar problemas de referencia
const User = mongoose.model('User');
const Supplier = mongoose.model('Supplier');
const Product = mongoose.model('Product');

// Middleware de validación mejorado
const validateSupplier = [
  body('name')
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ max: 100 }).withMessage('Máximo 100 caracteres'),
  
  body('email')
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Email inválido')
    .custom(async (value, { req }) => {
      const existing = await Supplier.findOne({ email: value });
      if (existing && (!req.params.id || existing._id.toString() !== req.params.id)) {
        throw new Error('Email ya registrado');
      }
      return true;
    }),

  body('products')
    .optional()
    .isArray().withMessage('Debe ser un arreglo de IDs')
    .custom(async (products) => {
      if (products && products.length > 0) {
        const count = await Product.countDocuments({ _id: { $in: products } });
        if (count !== products.length) {
          throw new Error('Algunos productos no existen');
        }
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }
    next();
  }
];

// Middleware para verificar token específico para suppliers
const verifySupplierToken = async (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ 
      success: false,
      message: "Token de autenticación requerido" 
    });
  }

  try {
    const formattedToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    const decoded = jwt.verify(formattedToken, config.secret);
    
    // Usar el modelo User directamente
    const user = await User.findById(decoded.id).populate('roles').exec();
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }
    
    req.userId = decoded.id;
    req.userRoles = user.roles.map(role => role.name);
    next();
  } catch (error) {
    console.error('Error en verificación de token:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expirado"
      });
    }
    
    return res.status(401).json({
      success: false,
      message: "Token inválido"
    });
  }
};

// Rutas para proveedores
router.post('/', 
  verifySupplierToken,
  (req, res, next) => {
    if (req.userRoles.includes('admin') || req.userRoles.includes('coordinador')) {
      return next();
    }
    res.status(403).json({
      success: false,
      message: "Requiere rol de administrador o coordinador"
    });
  },
  validateSupplier,
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
  (req, res, next) => {
    if (req.userRoles.includes('admin') || req.userRoles.includes('coordinador')) {
      return next();
    }
    res.status(403).json({
      success: false,
      message: "Requiere rol de administrador o coordinador"
    });
  },
  validateSupplier,
  supplierController.updateSupplier
);

router.delete('/:id', 
  verifySupplierToken,
  (req, res, next) => {
    if (req.userRoles.includes('admin')) {
      return next();
    }
    res.status(403).json({
      success: false,
      message: "Requiere rol de administrador"
    });
  },
  supplierController.deleteSupplier
);

module.exports = router;