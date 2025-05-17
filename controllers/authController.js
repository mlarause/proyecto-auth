const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const login = async (req, res) => {
  try {
    // 1. Buscar usuario (sin cambiar validaciones existentes)
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

    // 2. Comparar contraseña (manteniendo tu lógica actual)
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(401).json({ message: "Credenciales inválidas" });

    // 3. Generar token (ÚNICO CAMBIO ESENCIAL)
    const token = jwt.sign(
      { 
        id: user._id,
        role: user.role || 'user' // Fallback por si no existe
      }, 
      process.env.JWT_SECRET || 'fallback_secret_123', // Seguridad
      { expiresIn: '24h' }
    );

    // 4. Responder (manteniendo tu formato actual pero asegurando el token)
    res.status(200).json({
      token, // Asegurando que se envía el token
      user: {
        id: user._id,
        username: user.username, // Usando username en lugar de name
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = { login };