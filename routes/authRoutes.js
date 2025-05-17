const express = require('express');
const router = express.Router(); // ¡Usar express.Router()!
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middlewares/authJwt');

// Registro público
router.post('/register', userController.register);
router.post('/login', authController.login);

// Rutas protegidas
router.use(verifyToken); // Middleware para rutas siguientes

router.get('/', userController.getAllUsers);
router.post('/', isAdmin, userController.createUser);
router.put('/:id', isAdmin, userController.updateUser);
router.delete('/:id', isAdmin, userController.deleteUser);

module.exports = router;