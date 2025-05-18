const Supplier = require("../models/Supplier");
const { validatePermissions } = require("../utils/roleValidation");

// Crear proveedor (Admin o Coordinador)
exports.createSupplier = async (req, res) => {
  try {
    validatePermissions(req.user.role, ["admin", "coordinador"]);

    const { name, contact, address } = req.body;
    const newSupplier = await Supplier.create({
      name,
      contact,
      address,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: newSupplier,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};