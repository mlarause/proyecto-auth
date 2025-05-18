const Product = require("../models/Product");
const SubCategory = require("../models/Subcategory");
const Supplier = require("../models/Supplier");
const { validatePermissions } = require("../utils/roleValidation");

// Crear producto (Admin o Coordinador)
exports.createProduct = async (req, res) => {
  try {
    validatePermissions(req.user.role, ["admin", "coordinador"]);

    const { name, description, price, stock, subcategoryId, supplierId } = req.body;

    // Validar subcategoría y proveedor
    const [subcategory, supplier] = await Promise.all([
      SubCategory.findById(subcategoryId),
      Supplier.findById(supplierId),
    ]);

    if (!subcategory || !supplier) {
      return res.status(404).json({
        success: false,
        message: "Subcategoría o proveedor no encontrado",
      });
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      stock,
      category: subcategory.category, // Relación indirecta
      subcategory: subcategoryId,
      supplier: supplierId,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};