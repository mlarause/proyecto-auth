const Supplier = require('../models/Supplier');
const Product = require('../models/Product');

exports.createSupplier = async (req, res) => {
  try {
    const { name, contact, email, phone, address, products } = req.body;

    // 1. Validación de campos requeridos
    const requiredFields = { name, contact, email, phone, address };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Faltan campos obligatorios: ${missingFields.join(', ')}`
      });
    }

    // 2. Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
    }

    // 3. Verificar productos existentes
    if (products && products.length > 0) {
      const existingProducts = await Product.countDocuments({ 
        _id: { $in: products } 
      });
      
      if (existingProducts !== products.length) {
        return res.status(400).json({
          success: false,
          message: 'Uno o más productos no existen'
        });
      }
    }

    // 4. Crear proveedor
    const newSupplier = new Supplier({
      name,
      contact,
      email,
      phone,
      address,
      products: products || [],
      createdBy: req.userId
    });

    await newSupplier.save();

    return res.status(201).json({
      success: true,
      data: newSupplier,
      message: 'Proveedor creado exitosamente'
    });

  } catch (error) {
    console.error('Error en createSupplier:', error);

    // Manejo específico de errores
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'El correo electrónico ya está registrado'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al crear el proveedor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};