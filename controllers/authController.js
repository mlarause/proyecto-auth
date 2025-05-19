const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

exports.registrar = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        // Verificar si el usuario ya existe
        const existeUsuario = await User.findOne({ email });
        if (existeUsuario) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El usuario ya existe'
            });
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);

        // Crear nuevo usuario
        const usuario = new User({
            nombre,
            email,
            password: passwordEncriptada,
            rol: rol || 'auxiliar'
        });

        await usuario.save();

        // Crear token JWT
        const token = jwt.sign(
            { id: usuario._id, rol: usuario.rol },
            config.SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            exito: true,
            mensaje: 'Usuario registrado correctamente',
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });

    } catch (error) {
        res.status(500).json({
            exito: false,
            mensaje: 'Error al registrar usuario',
            error: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar usuario
        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Usuario no encontrado'
            });
        }

        // Validar contraseña
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Credenciales inválidas'
            });
        }

        // Crear token JWT
        const token = jwt.sign(
            { id: usuario._id, rol: usuario.rol },
            config.SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            exito: true,
            mensaje: 'Login exitoso',
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });

    } catch (error) {
        res.status(500).json({
            exito: false,
            mensaje: 'Error al iniciar sesión',
            error: error.message
        });
    }
};