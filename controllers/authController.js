const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const login = async (req, res) => {
  try {
    // Validación mejorada de entrada
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email y contraseña son requeridos" 
      });
    }

    // Buscar usuario con manejo de errores
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas"
      });
    }

    // Comparación de contraseña segura
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas"
      });
    }

    // Generación del token con estructura completa
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role || 'user',
      username: user.username
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || 'fallback_secret_123',
      { expiresIn: '24h' }
    );

    // Respuesta estructurada
    const responseData = {
      success: true,
      message: "Autenticación exitosa",
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      }
    };

    res.status(200).json(responseData);

  } catch (error) {
    console.error("Error en authController:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

module.exports = { login };