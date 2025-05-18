const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/auth');

// Ruta para obtener todos los usuarios (solo admin)
router.get('/', 
  verifyToken,
  (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Acceso no autorizado" });
    }
    next();
  },
  userController.getAllUsers
);

// Ruta para obtener un usuario específico
router.get('/:id', 
  verifyToken,
  userController.getUser
);

// Ruta para actualizar usuario
router.put('/:id', 
  verifyToken,
  userController.updateUser
);

module.exports = router;