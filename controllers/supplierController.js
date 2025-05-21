const db = require("../models");
const Supplier = db.supplier;

exports.create = async (req, res) => {
  try {
    const supplier = new Supplier({
      name: req.body.name,
      contact: req.body.contact,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      products: req.body.products || [],
      createdBy: req.userId
    });

    const savedSupplier = await supplier.save();
    res.status(201).send(savedSupplier);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const suppliers = await Supplier.find().populate('products', 'name');
    res.status(200).send(suppliers);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id).populate('products', 'name description');
    
    if (!supplier) {
      return res.status(404).send({ message: "Proveedor no encontrado" });
    }
    
    res.status(200).send(supplier);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedSupplier) {
      return res.status(404).send({ message: "Proveedor no encontrado" });
    }

    res.status(200).send(updatedSupplier);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndRemove(req.params.id);
    
    if (!deletedSupplier) {
      return res.status(404).send({ message: "Proveedor no encontrado" });
    }
    
    res.status(200).send({ message: "Proveedor eliminado exitosamente" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};