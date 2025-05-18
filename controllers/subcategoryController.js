const SubCategory = require("../models/Subcategory");
const Category = require("../models/Category");
const { validatePermissions } = require("../utils/roleValidation");

// Crear subcategoría (Admin o Coordinador)
exports.createSubCategory = async (req, res) => {
  try {
    validatePermissions(req.user.role, ["admin", "coordinador"]);

    const { name, categoryId } = req.body;

    // Verificar si la categoría existe
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada",
      });
    }

    const newSubCategory = await SubCategory.create({
      name,
      category: categoryId,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: newSubCategory,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// Obtener subcategorías por categoría (Todos los roles)
exports.getSubCategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subcategories = await SubCategory.find({ category: categoryId }).populate("category", "name");

    res.status(200).json({
      success: true,
      data: subcategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener subcategorías",
    });
  }
};