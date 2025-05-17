const Supplier = require('../models/Supplier');

module.exports = {
  // Crear un nuevo proveedor
  createSupplier: async (req, res) => {
    try {
      const supplier = new Supplier({
        name: req.body.name,
        contact: req.body.contact,
        phone: req.body.phone,
        address: req.body.address,
        email: req.body.email
      });

      await supplier.save();

      res.status(201).json({
        success: true,
        supplier: supplier
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear proveedor',
        error: error.message
      });
    }
  },

  // Obtener todos los proveedores
  getAllSuppliers: async (req, res) => {
    try {
      const suppliers = await Supplier.find().sort({ name: 1 });
      res.status(200).json({
        success: true,
        suppliers: suppliers
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener proveedores',
        error: error.message
      });
    }
  },

  // Obtener un proveedor por ID
  getSupplierById: async (req, res) => {
    try {
      const supplier = await Supplier.findById(req.params.id);
      
      if (!supplier) {
        return res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado'
        });
      }

      res.status(200).json({
        success: true,
        supplier: supplier
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener proveedor',
        error: error.message
      });
    }
  },

  // Actualizar un proveedor
  updateSupplier: async (req, res) => {
    try {
      const supplier = await Supplier.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!supplier) {
        return res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado'
        });
      }

      res.status(200).json({
        success: true,
        supplier: supplier
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar proveedor',
        error: error.message
      });
    }
  },

  // Eliminar un proveedor
  deleteSupplier: async (req, res) => {
    try {
      const supplier = await Supplier.findByIdAndDelete(req.params.id);

      if (!supplier) {
        return res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Proveedor eliminado correctamente'
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar proveedor',
        error: error.message
      });
    }
  }
};