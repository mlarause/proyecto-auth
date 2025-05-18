const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { username, email, password, rol } = req.body;

    // Validación básica
    if (!username || !email || !password || !rol) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      rol
    });

    // Guardar usuario
    await newUser.save();

    // Generar token
    const token = jwt.sign(
      { _id: newUser._id, rol: newUser.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        rol: newUser.rol
      }
    });

  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const login = async (req, res) => {
  try {
    console.log("Solicitud de login recibida"); // Log de depuración
    
    const { email, password } = req.body;
    
    // Validación básica
    if (!email || !password) {
      console.log("Faltan email o contraseña");
      return res.status(400).json({ message: "Email y contraseña requeridos" });
    }

    console.log("Buscando usuario en la base de datos...");
    const user = await User.findOne({ email }).select('+password').maxTimeMS(5000); // Timeout de 5 segundos
    
    if (!user) {
      console.log("Usuario no encontrado");
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    console.log("Comparando contraseñas...");
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log("Contraseña incorrecta");
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    console.log("Generando token...");
    const token = jwt.sign(
      { _id: user._id, rol: user.rol },
      process.env.JWT_SECRET || 'fallback_secret_123',
      { expiresIn: '1h' }
    );

    console.log("Login exitoso, enviando respuesta");
    res.status(200).json({
      message: "Login exitoso",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ 
      message: "Error en el servidor",
      error: error.message 
    });
  }
};


module.exports = {
  register,
  login
};