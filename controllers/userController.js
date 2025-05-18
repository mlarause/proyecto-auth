const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios (solo admin)
exports.getAllUsers = async (req, res) => {
  try {
    // Verificar rol de admin (si tu sistema lo requiere)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "No autorizado" });
    }

    const users = await User.find().select('-password');
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error al obtener usuarios",
      error: error.message 
    });
  }
};

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "Usuario no encontrado" 
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error al buscar usuario",
      error: error.message 
    });
  }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
  try {
    // No permitir actualizar el rol a menos que sea admin
    if (req.body.role && req.user.role !== 'admin') {
      delete req.body.role;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false,
        message: "Usuario no encontrado" 
      });
    }

    res.json({
      success: true,
      message: "Usuario actualizado",
      data: updatedUser
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: "Error al actualizar usuario",
      error: error.message 
    });
  }
};

// Eliminar usuario (solo admin)
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: "No autorizado" 
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "Usuario no encontrado" 
      });
    }

    res.json({
      success: true,
      message: "Usuario eliminado"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error al eliminar usuario",
      error: error.message 
    });
  }
};

// Cambiar contraseña
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // 1. Obtener usuario
    const user = await User.findById(req.params.id).select('+password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "Usuario no encontrado" 
      });
    }

    // 2. Verificar contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: "Contraseña actual incorrecta" 
      });
    }

    // 3. Hashear nueva contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // 4. Guardar usuario
    await user.save();

    res.json({
      success: true,
      message: "Contraseña actualizada"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error al cambiar contraseña",
      error: error.message 
    });
  }
};