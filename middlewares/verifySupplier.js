const db = require("../models");
const Supplier = db.supplier;

checkDuplicateSupplierEmail = async (req, res, next) => {
  try {
    const supplier = await Supplier.findOne({ email: req.body.email });
    
    if (supplier) {
      return res.status(400).json({
        success: false,
        message: "Error. El email ya está en uso"
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  checkDuplicateSupplierEmail
};