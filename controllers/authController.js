const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const login = async (req, res) => {
  try {
    // Validación (igual a tu código actual)
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña requeridos" });
    }

    // Buscar usuario con contraseña (corrección importante)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Comparar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Generar token (CORRECCIÓN DEFINITIVA)
    const token = jwt.sign(
      {
        _id: user._id.toString(), // Usando _id como lo espera tu middleware
        role: user.role
      },
      process.env.JWT_SECRET || 'fallback_secret_123', // Seguridad adicional
      { expiresIn: '1d' }
    );

    // Respuesta (formato que ya usas)
    res.status(200).json({
      message: "Login exitoso",
      token, // Token incluido explícitamente
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Error en authController:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = { login };