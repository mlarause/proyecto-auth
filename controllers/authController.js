const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

exports.signup = async (req, res) => {
  try {
    const { username, email, password, rol } = req.body;

    // Validar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El usuario ya existe'
      });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario (usando "rol" en lugar de "role")
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      rol: rol || 'auxiliar' // Valor por defecto
    });

    // Crear token JWT con la propiedad "rol" (no "role")
    const token = jwt.sign(
      {
        id: user._id,
        rol: user.rol // Cambiado de 'role' a 'rol' para coincidir con tu DB
      },
      config.SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Validar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: 'Contraseña incorrecta'
      });
    }

    // Crear token JWT con la propiedad "rol" (no "role")
    const token = jwt.sign(
      {
        id: user._id,
        rol: user.rol // Cambiado de 'role' a 'rol' para coincidir con tu DB
      },
      config.SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};