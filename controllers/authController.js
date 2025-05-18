const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    // Validación de entrada
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: "Email y contraseña requeridos" });
    }

    // Buscar usuario (con contraseña)
    const user = await User.findOne({ email: req.body.email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Comparar contraseña
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Generar token (formato que ya usabas)
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret_123',
      { expiresIn: '1h' }
    );

    // Respuesta con token
    res.status(200).json({
      message: "Login exitoso",
      token: token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { login };