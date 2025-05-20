const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const { check } = require('express-validator');

exports.verifyToken = [
    check('token', 'Token es requerido').notEmpty(),
    (req, res, next) => {
        const token = req.header('x-auth-token') || req.header('authorization')?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Acceso denegado. Token no proporcionado'
            });
        }

        try {
            const decoded = jwt.verify(token, config.secret);
            req.user = decoded;
            next();
        } catch (ex) {
            res.status(400).json({
                success: false,
                message: 'Token inválido o expirado',
                error: ex.message
            });
        }
    }
];

exports.isAdmin = (req, res, next) => {
    if (req.user.roles.includes('admin')) {
        return next();
    }
    res.status(403).json({
        success: false,
        message: 'Se requiere rol de administrador'
    });
};

exports.isCoordinator = (req, res, next) => {
    if (req.user.roles.includes('coordinator')) {
        return next();
    }
    res.status(403).json({
        success: false,
        message: 'Se requiere rol de coordinador'
    });
};