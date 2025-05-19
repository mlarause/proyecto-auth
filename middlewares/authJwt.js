const jwt = require('jsonwebtoken');
const config = require('../config');

exports.verificarToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({
            exito: false,
            mensaje: 'Token no proporcionado'
        });
    }

    jwt.verify(token.replace('Bearer ', ''), config.SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                exito: false,
                mensaje: 'Token inválido'
            });
        }
        req.usuarioId = decoded.id;
        req.usuarioRol = decoded.rol;
        next();
    });
};

exports.esAdmin = (req, res, next) => {
    if (req.usuarioRol !== 'admin') {
        return res.status(403).json({
            exito: false,
            mensaje: 'Se requiere rol de administrador'
        });
    }
    next();
};