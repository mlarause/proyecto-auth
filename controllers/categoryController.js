const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Verificación adicional para manejar el error de duplicados
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre'
      });
    }

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
    console.error('Error al crear categoría:', error);
    
    // Manejo específico para errores de MongoDB
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de la categoría ya existe',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al crear categoría',
      error: error.message
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las categorías',
      error: error.message
    });
  }
};

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
    console.error('Error al obtener categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la categoría',
      error: error.message
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Verificar si el nuevo nombre ya existe en otra categoría
    if (name) {
      const existingCategory = await Category.findOne({
        name: name.trim(),
        _id: { $ne: req.params.id }
      });
      
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe otra categoría con ese nombre'
        });
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: name ? name.trim() : undefined,
        description: description ? description.trim() : undefined
      },
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
      message: 'Categoría actualizada exitosamente',
      data: updatedCategory
    });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de la categoría ya existe',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al actualizar la categoría',
      error: error.message
    });
  }
};

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
      message: 'Categoría eliminada exitosamente',
      data: deletedCategory
    });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la categoría',
      error: error.message
    });
  }
};