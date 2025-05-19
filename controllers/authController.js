const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

// Función para registrar usuarios
exports.signup = async (req, res) => {
    try {
        const { username, email, password, rol } = req.body;

        // Validación básica
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos obligatorios'
            });
        }

        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'El correo ya está registrado'
            });
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear nuevo usuario
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            rol: rol || 'auxiliar'
        });

        // Guardar en la base de datos
        const savedUser = await newUser.save();

        // Crear token JWT
        const token = jwt.sign(
            {
                id: savedUser._id,
                rol: savedUser.rol
            },
            config.SECRET,
            { expiresIn: '1h' }
        );

        // Responder sin enviar la contraseña
        const userResponse = {
            _id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            rol: savedUser.rol,
            createdAt: savedUser.createdAt
        };

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            token,
            user: userResponse
        });

    } catch (error) {
        console.error('Error en signup:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar usuario',
            error: error.message
        });
    }
};

// Función para iniciar sesión
exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar campos
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos'
            });
        }

        // Buscar usuario
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Validar contraseña
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Generar token
        const token = jwt.sign(
            {
                id: user._id,
                rol: user.rol
            },
            config.SECRET,
            { expiresIn: '1h' }
        );

        // Preparar respuesta
        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            rol: user.rol
        };

        res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso',
            token,
            user: userResponse
        });

    } catch (error) {
        console.error('Error en signin:', error);
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión',
            error: error.message
        });
    }
};