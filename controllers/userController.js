const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

/**
 * Registra un nuevo usuario (público)
 */
exports.register = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      rol: req.body.rol || 'auxiliar' // Valor por defecto
    });

    await user.save();

    // Generar token JWT
    const token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // 24 horas
    });

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        rol: user.rol
      },
      accessToken: token
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
      error: error.message
    });
  }
};

/**
 * Obtiene todos los usuarios (requiere admin)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      users: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Crea un usuario (admin only)
 */
exports.createUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      rol: req.body.rol
    });

    await user.save();

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        rol: user.rol
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Actualiza un usuario (admin only)
 */
exports.updateUser = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Encriptar contraseña si se proporciona
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      user: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Elimina un usuario (admin only)
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      message: "Usuario eliminado correctamente"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Obtiene un usuario por ID (admin/coordinador)
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      user: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};