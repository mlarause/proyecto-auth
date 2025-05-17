const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const login = async (req, res) => {
  try {
    // Validación mejorada
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ 
        success: false,
        message: "Email y contraseña son requeridos" 
      });
    }

    // Buscar usuario
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Contraseña incorrecta"
      });
    }

    // Generar token con estructura COMPLETA
    const token = jwt.sign(
      {
        userId: user._id.toString(), // Asegurar que es string
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET || 'fallback_secret_123',
      { expiresIn: '24h' }
    );

    // Respuesta garantizada
    res.status(200).json({
      success: true,
      message: "Autenticación exitosa",
      token: token, // Token incluido directamente
      userData: {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor"
    });
  }
};

module.exports = { login };