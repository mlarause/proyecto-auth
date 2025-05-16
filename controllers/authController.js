const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

exports.signup = async (req, res) => {
  try {
    // La contraseña se encripta automáticamente por el pre-save hook
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password, // Se encriptará antes de guardar
      rol: req.body.rol
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // 24 horas
    });

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      user: {
        email: user.email,
        rol: user.rol,
        _id: user._id
      },
      accessToken: token
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
      error: error.message
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "Usuario no encontrado" 
      });
    }

    const passwordIsValid = await user.comparePassword(req.body.password);

    if (!passwordIsValid) {
      return res.status(401).json({
        success: false,
        message: "Contraseña incorrecta"
      });
    }

    const token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // 24 horas
    });

    res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      user: {
        email: user.email,
        rol: user.rol,
        _id: user._id
      },
      accessToken: token
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
      error: error.message
    });
  }
};