const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const login = async (req, res) => {
  try {
    // Validación (igual a tu código actual)
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ message: "Email y contraseña requeridos" });
    }

    // Buscar usuario (sin cambios)
    const user = await User.findOne({ email });
    if (!user) return res.status(401).send({ message: "Credenciales inválidas" });

    // Comparar contraseña (igual que ahora)
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).send({ message: "Credenciales inválidas" });

    // Generar token (AJUSTE CLAVE)
    const token = jwt.sign(
      {
        userId: user._id.toString(), // Nombre exacto que esperas en otras rutas
        role: user.role
      },
      process.env.JWT_SECRET || 'fallback_secret', // Seguridad adicional
      { expiresIn: '1d' }
    );

    // Respuesta (formato que ya usas)
    res.status(200).send({
      message: "Login exitoso",
      token, // Token incluido
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).send({ message: "Error en el servidor" });
  }
};

module.exports = { login };