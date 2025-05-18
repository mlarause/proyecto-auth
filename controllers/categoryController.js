const Category = require("../models/Category");
const { validatePermissions } = require("../utils/roleValidation");

// Crear categoría (Admin o Coordinador)
exports.createCategory = async (req, res) => {
  try {
    validatePermissions(req.user.role, ["admin", "coordinador"]);

    const { name, description } = req.body;
    const newCategory = await Category.create({
      name,
      description,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: newCategory,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// Obtener todas las categorías (Todos los roles)
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("createdBy", "username");
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener categorías",
    });
  }
};

// Actualizar categoría (Admin o Coordinador)
exports.updateCategory = async (req, res) => {
  try {
    validatePermissions(req.user.role, ["admin", "coordinador"]);

    const { id } = req.params;
    const { name, description } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedCategory,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// Eliminar categoría (Solo Admin)
exports.deleteCategory = async (req, res) => {
  try {
    validatePermissions(req.user.role, ["admin"]);

    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      message: "Categoría eliminada correctamente",
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};