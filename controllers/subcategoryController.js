const Subcategory = require('../models/Subcategory');
const Category = require('../models/Category');

module.exports = {
  // Crear una nueva subcategoría
  createSubcategory: async (req, res) => {
    try {
      // Verificar que la categoría padre exista
      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(404).json({ 
          success: false,
          message: 'Categoría no encontrada' 
        });
      }

      const subcategory = new Subcategory({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category
      });

      await subcategory.save();

      // Agregar la subcategoría a la categoría padre
      category.subcategories.push(subcategory._id);
      await category.save();

      res.status(201).json({
        success: true,
        subcategory: subcategory
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear subcategoría',
        error: error.message
      });
    }
  },

  // Obtener todas las subcategorías
  getAllSubcategories: async (req, res) => {
    try {
      const subcategories = await Subcategory.find().populate('category', 'name');
      res.status(200).json({
        success: true,
        subcategories: subcategories
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener subcategorías',
        error: error.message
      });
    }
  },

  // Obtener una subcategoría por ID
  getSubcategoryById: async (req, res) => {
    try {
      const subcategory = await Subcategory.findById(req.params.id).populate('category');
      
      if (!subcategory) {
        return res.status(404).json({
          success: false,
          message: 'Subcategoría no encontrada'
        });
      }

      res.status(200).json({
        success: true,
        subcategory: subcategory
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener subcategoría',
        error: error.message
      });
    }
  },

  // Actualizar una subcategoría
  updateSubcategory: async (req, res) => {
    try {
      const subcategory = await Subcategory.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!subcategory) {
        return res.status(404).json({
          success: false,
          message: 'Subcategoría no encontrada'
        });
      }

      res.status(200).json({
        success: true,
        subcategory: subcategory
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar subcategoría',
        error: error.message
      });
    }
  },

  // Eliminar una subcategoría
  deleteSubcategory: async (req, res) => {
    try {
      const subcategory = await Subcategory.findByIdAndDelete(req.params.id);

      if (!subcategory) {
        return res.status(404).json({
          success: false,
          message: 'Subcategoría no encontrada'
        });
      }

      // Eliminar referencia de la categoría padre
      await Category.updateOne(
        { _id: subcategory.category },
        { $pull: { subcategories: subcategory._id } }
      );

      res.status(200).json({
        success: true,
        message: 'Subcategoría eliminada correctamente'
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar subcategoría',
        error: error.message
      });
    }
  }
};