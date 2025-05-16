const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin, isCoordinador } = require('../middlewares/authJwt');

// Ruta de registro público
router.post('/register', async (req, res) => {
  try {
    await userController.register(req, res);
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor",
      error: error.message 
    });
  }
});

// Middleware de autenticación para rutas siguientes
router.use(verifyToken);

// Obtener todos los usuarios (Admin)
router.get('/', isAdmin, async (req, res) => {
  try {
    await userController.getAllUsers(req, res);
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al obtener usuarios" 
    });
  }
});

// Crear usuario (Admin)
router.post('/', isAdmin, async (req, res) => {
  try {
    await userController.createUser(req, res);
  } catch (error) {
    console.error("Error creando usuario:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al crear usuario" 
    });
  }
});

// Actualizar usuario (Admin)
router.put('/:id', isAdmin, async (req, res) => {
  try {
    await userController.updateUser(req, res);
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al actualizar usuario" 
    });
  }
});

// Eliminar usuario (Admin)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    await userController.deleteUser(req, res);
  } catch (error) {
    console.error("Error eliminando usuario:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al eliminar usuario" 
    });
  }
});

// Obtener usuario por ID (Admin/Coordinador)
router.get('/:id', isCoordinador, async (req, res) => {
  try {
    await userController.getUserById(req, res);
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al obtener usuario" 
    });
  }
});

module.exports = router;