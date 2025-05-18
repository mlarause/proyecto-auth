const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios (solo admin)
exports.getAllUsers = async (req, res) => {
  try {
    // Verificar rol de admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Acceso no autorizado" });
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

    // Solo admin o el propio usuario puede ver los datos
    if (req.user.role !== 'admin' && req.user._id !== user._id.toString()) {
      return res.status(403).json({ 
        success: false,
        message: "No autorizado" 
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

// Crear usuario (registro)
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validar campos requeridos
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Todos los campos son requeridos" 
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: "El usuario ya existe" 
      });
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'user' // Valor por defecto
    });

    // Guardar usuario
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
    // Solo admin puede cambiar el rol
    if (req.body.role && req.user.role !== 'admin') {
      delete req.body.role;
    }

    // No permitir que usuarios normales actualicen otros perfiles
    if (req.user.role !== 'admin' && req.user._id !== req.params.id) {
      return res.status(403).json({ 
        success: false,
        message: "No autorizado" 
      });
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
    
    // Obtener usuario
    const user = await User.findById(req.params.id).select('+password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "Usuario no encontrado" 
      });
    }

    // Verificar que sea el propio usuario o admin
    if (req.user._id !== user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: "No autorizado" 
      });
    }

    // Verificar contraseña actual (excepto para admin)
    if (req.user.role !== 'admin') {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ 
          success: false,
          message: "Contraseña actual incorrecta" 
        });
      }
    }

    // Hashear nueva contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Guardar usuario
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

// Obtener perfil de usuario
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "Usuario no encontrado" 
      });
    }

    // Solo admin o el propio usuario puede ver el perfil
    if (req.user.role !== 'admin' && req.user._id !== user._id.toString()) {
      return res.status(403).json({ 
        success: false,
        message: "No autorizado" 
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error al obtener perfil",
      error: error.message 
    });
  }

  const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email } = req.body;

        // Verifica si el ID es válido antes de usarlo
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "ID de usuario no válido",
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { username, email },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado",
            });
        }

        res.status(200).json({
            success: true,
            message: "Usuario actualizado correctamente",
            data: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar usuario",
            error: error.message, // Mejor para debugging
        });
    }
};
};