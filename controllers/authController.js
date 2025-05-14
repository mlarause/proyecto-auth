const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

// Función de Registro Mejorada
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validación mejorada
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Crear usuario SIN hashear aquí (dejamos que el modelo lo haga)
    const user = new User({
      username,
      email,
      password, // Se hasheará automáticamente en el pre-save hook
      roles: req.body.roles || ['auxiliar']
    });

    // Guardar usuario
    await user.save();
    
    // Generar token
    const token = jwt.sign(
      { id: user._id },
      config.secret,
      { expiresIn: config.jwtExpiration }
    );

    // Preparar respuesta
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: userResponse,
      accessToken: token
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Función de Login Mejorada
exports.signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Intento de login para:', username, 'con pass:', password);

    const user = await User.findOne({ username }).select('+password');
    
    if (!user) {
      console.log('Usuario no encontrado en BD');
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    // Debug: Mostrar hash almacenado
    console.log('Hash almacenado:', user.password);

    // Comparación directa con bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Resultado comparación:', isMatch);

    if (!isMatch) {
      // Debug adicional: Intentar recrear el hash
      const testHash = await bcrypt.hash(password, user.password.substring(0, 29));
      console.log('Hash recalculado:', testHash);
      console.log('Coincide con almacenado?', testHash === user.password);
      
      return res.status(401).json({
        success: false,
        accessToken: null,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user._id,
        username: user.username,
        roles: user.roles 
      },
      config.secret,
      { expiresIn: config.jwtExpiration }
    );

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles
      },
      accessToken: token
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};