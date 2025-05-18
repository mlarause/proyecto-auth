const User = require('../models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Obtener todos los usuarios (admin)
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Acceso no autorizado" });
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

// Obtener usuario por ID
exports.getUserById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "ID de usuario inválido" });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    if (req.user.role !== 'admin' && req.user._id !== req.params.id) {
      return res.status(403).json({ success: false, message: "Acceso no autorizado" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error al buscar usuario",
      error: error.message 
    });
  }
};

// Crear usuario (admin)
exports.createUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Acceso no autorizado" });
    }

    const { username, email, password, role } = req.body;

    // Validación básica
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "Todos los campos son requeridos" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "El usuario ya existe" });
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    await newUser.save();

    // Omitir password en la respuesta
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({ 
      success: true, 
      message: "Usuario creado exitosamente",
      data: userResponse 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error al crear usuario",
      error: error.message 
    });
  }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "ID de usuario inválido" });
    }

    // Verificar permisos
    if (req.user.role !== 'admin' && req.user._id !== req.params.id) {
      return res.status(403).json({ success: false, message: "Acceso no autorizado" });
    }

    // Solo admin puede cambiar el rol
    if (req.body.role && req.user.role !== 'admin') {
      delete req.body.role;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
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

// Eliminar usuario (admin)
exports.deleteUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "ID de usuario inválido" });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Acceso no autorizado" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    res.json({ 
      success: true, 
      message: "Usuario eliminado correctamente" 
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "ID de usuario inválido" });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id).select('+password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    // Verificar permisos (admin o el propio usuario)
    if (req.user.role !== 'admin' && req.user._id !== req.params.id) {
      return res.status(403).json({ success: false, message: "Acceso no autorizado" });
    }

    // Verificar contraseña actual (excepto para admin)
    if (req.user.role !== 'admin') {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Contraseña actual incorrecta" });
      }
    }

    // Hashear nueva contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ 
      success: true, 
      message: "Contraseña actualizada correctamente" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error al cambiar contraseña",
      error: error.message 
    });
  }
};