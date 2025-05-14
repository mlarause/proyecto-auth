const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

// Función de registro COMPLETA
exports.signup = async (req, res) => {
  try {
    // Validación básica
    if (!req.body.username || !req.body.email || !req.body.password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Crear nuevo usuario con contraseña hasheada
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 12), // Hash con salt rounds = 12
      roles: req.body.roles || ['auxiliar'] // Rol por defecto
    });

    // Guardar en MongoDB
    await user.save();

    // Respuesta exitosa (sin incluir password)
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'Usuario registrado exitosamente!',
      user: userResponse
    });

  } catch (error) {
    // Manejo específico de errores de duplicados
    if (error.code === 11000) {
      const field = error.message.includes('email') ? 'email' : 'username';
      return res.status(400).json({ 
        message: `El ${field} ya está registrado` 
      });
    }
    
    // Otros errores
    res.status(500).json({ 
      message: 'Error al registrar usuario',
      error: error.message 
    });
  }
};

// Función de login COMPLETA
exports.signin = async (req, res) => {
  try {
    // Validación
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
    }

    // Buscar usuario (incluyendo el campo password)
    const user = await User.findOne({ username: req.body.username }).select('+password');
    
    if (!user) {
      return res.status(404).json({ 
        accessToken: null,
        message: 'Usuario no encontrado' 
      });
    }

    // Comparar contraseñas
    const passwordIsValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    
    if (!passwordIsValid) {
      return res.status(401).json({
        accessToken: null,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user._id,
        username: user.username,
        roles: user.roles 
      }, 
      config.secret,
      { 
        expiresIn: config.jwtExpiration // Ej: "2h", "7d" 
      }
    );

    // Respuesta exitosa (sin incluir password)
    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      ...userData,
      accessToken: token
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      message: 'Error interno al iniciar sesión',
      error: error.message 
    });
  }
};