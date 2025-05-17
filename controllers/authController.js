const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    // 1. Validar entrada
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: "Email y contraseña son requeridos" });
    }

    // 2. Buscar usuario
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // 3. Verificar contraseña
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // 4. Generar token (corregido)
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET || 'fallback_secret_key', // Seguridad adicional
      { expiresIn: '24h' }
    );

    // 5. Enviar respuesta (formato corregido)
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = { login };