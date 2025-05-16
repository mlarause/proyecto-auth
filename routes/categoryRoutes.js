const express = require('express');
const router = express.Router(); // Usando express.Router()
const categoryController = require('../controllers/categoryController');
const { verifyToken, isAdmin } = require('../middlewares/authJwt');

// Rutas públicas (si existen)
// router.get('/', categoryController.getAllCategories);

// Middleware de autenticación para rutas siguientes
router.use(verifyToken);

// Crear categoría (Admin)
router.post('/', isAdmin, async (req, res) => {
  try {
    await categoryController.createCategory(req, res);
  } catch (error) {
    console.error("Error creando categoría:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al crear categoría",
      error: error.message 
    });
  }
});

// Actualizar categoría (Admin)
router.put('/:id', isAdmin, async (req, res) => {
  try {
    await categoryController.updateCategory(req, res);
  } catch (error) {
    console.error("Error actualizando categoría:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al actualizar categoría" 
    });
  }
});

// Eliminar categoría (Admin)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    await categoryController.deleteCategory(req, res);
  } catch (error) {
    console.error("Error eliminando categoría:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al eliminar categoría" 
    });
  }
});

// Obtener todas las categorías (Público o autenticado)
router.get('/', async (req, res) => {
  try {
    await categoryController.getAllCategories(req, res);
  } catch (error) {
    console.error("Error obteniendo categorías:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al obtener categorías" 
    });
  }
});

// Obtener categoría específica
router.get('/:id', async (req, res) => {
  try {
    await categoryController.getCategoryById(req, res);
  } catch (error) {
    console.error("Error obteniendo categoría:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al obtener categoría" 
    });
  }
});

module.exports = router;