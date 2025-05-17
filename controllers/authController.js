const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const login = async (req, res) => {
  try {
    // 1. Validación (manteniendo tu estilo actual)
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: "Email y contraseña requeridos" });
    }

    // 2. Buscar usuario (igual que en tu código)
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // 3. Comparar contraseña (sin cambios)
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // 4. Generar token (ÚNICO CAMBIO NECESARIO)
    const token = jwt.sign(
      {
        id: user._id,  // Usando 'id' como ya lo esperan tus otras rutas
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 5. Responder (formato que ya usas)
    res.status(200).json({
      message: "Login exitoso",
      token,  // Token en el body
      user: {
        id: user._id,
        username: user.username, // Manteniendo tus nombres de campo
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { login };