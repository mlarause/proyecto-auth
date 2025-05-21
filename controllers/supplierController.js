const db = require("../models");
const Supplier = db.supplier;
const User = db.user;

exports.createSupplier = async (req, res) => {
  try {
    // Verificar si el usuario existe
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const supplier = new Supplier({
      name: req.body.name,
      contact: req.body.contact,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      products: req.body.products || [],
      createdBy: req.userId
    });

    await supplier.save();
    res.status(201).json(supplier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().populate('products', 'name description');
    res.status(200).json(suppliers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id).populate('products', 'name description');
    if (!supplier) {
      return res.status(404).json({ message: "Proveedor no encontrado." });
    }
    res.status(200).json(supplier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSupplier = async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedSupplier) {
      return res.status(404).json({ message: "Proveedor no encontrado." });
    }
    
    res.status(200).json(updatedSupplier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!deletedSupplier) {
      return res.status(404).json({ message: "Proveedor no encontrado." });
    }
    res.status(200).json({ message: "Proveedor eliminado exitosamente." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};