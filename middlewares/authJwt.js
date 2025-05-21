const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;

verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    
    if (!token) {
        return res.status(403).json({
            success: false,
            message: "No se proporcionó token"
        });
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    jwt.verify(token, config.secret, async (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: "Token inválido"
            });
        }

        try {
            const user = await User.findById(decoded.id).exec();
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Usuario no encontrado"
                });
            }
            
            req.userId = decoded.id;
            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error al verificar usuario"
            });
        }
    });
};

isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).exec();
        const roles = await db.role.find({ _id: { $in: user.roles } });

        const isAdmin = roles.some(role => role.name === 'admin');
        if (!isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Se requieren privilegios de administrador"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al verificar roles"
        });
    }
};

module.exports = {
    verifyToken,
    isAdmin
};