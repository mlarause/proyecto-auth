const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extraer token de Bearer
    
    if (!token) {
        return res.status(403).json({ 
            success: false,
            message: "Token no proporcionado" 
        });
    }

    jwt.verify(token, config.secret, (err, user) => {
        if (err) {
            return res.status(401).json({ 
                success: false,
                message: "Token inválido o expirado" 
            });
        }
        req.user = user;
        next();
    });
};

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        const roles = await user.getRoles();
        
        if (roles.some(role => role.name === 'admin')) {
            return next();
        }
        
        res.status(403).json({
            success: false,
            message: "Se requiere rol de administrador"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al verificar roles"
        });
    }
};

module.exports = {
    verifyToken,
    isAdmin
};