const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validar que el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // 2. Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // 3. Crear el payload del token
    const payload = {
      id: user._id,
      role: user.role
    };

    // 4. Generar el token (corrección clave)
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback_secret_123', // Asegurar que siempre haya secreto
      { expiresIn: '24h' }
    );

    // 5. Enviar respuesta (formato corregido)
    res.status(200).json({
      success: true,
      token: 'Bearer ' + token, // Formato estándar
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { login };