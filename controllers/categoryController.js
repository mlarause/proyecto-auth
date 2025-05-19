const Category = require('../models/Category');

// Crear nueva categoría
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validación de campos requeridos
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y descripción son obligatorios'
      });
    }

    // Verificar si ya existe (case-insensitive)
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre'
      });
    }

    // Crear y guardar la nueva categoría
    const newCategory = new Category({
      name: name.trim(),
      description: description.trim()
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: newCategory
    });

  } catch (error) {
    console.error('Error en createCategory:', error);
    
    // Manejo específico de error de duplicados
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de categoría ya existe'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al crear categoría',
      error: error.message
    });
  }
};

// Obtener todas las categorías
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Error en getCategories:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías'
    });
  }
};

// Obtener categoría por ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error en getCategoryById:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener categoría'
    });
  }
};

// Actualizar categoría
exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Verificar si el nuevo nombre ya existe en otra categoría
    if (name) {
      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
        _id: { $ne: req.params.id }
      });
      
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe otra categoría con ese nombre'
        });
      }
    }

    const updatedData = {};
    if (name) updatedData.name = name.trim();
    if (description) updatedData.description = description.trim();

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Categoría actualizada',
      data: updatedCategory
    });
  } catch (error) {
    console.error('Error en updateCategory:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de categoría ya existe'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al actualizar categoría'
    });
  }
};

// Eliminar categoría
exports.deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    
    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Categoría eliminada',
      data: deletedCategory
    });
  } catch (error) {
    console.error('Error en deleteCategory:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar categoría'
    });
  }
};