const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    
    if (!token) {
        return res.status(403).json({ 
            success: false,
            message: "Token de autenticación no proporcionado" 
        });
    }

    // Extraer token si viene como Bearer
    const tokenValue = token.startsWith('Bearer ') ? token.slice(7) : token;

    jwt.verify(tokenValue, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ 
                success: false,
                message: "Token inválido o expirado" 
            });
        }
        req.userId = decoded.id;
        next();
    });
};

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId, {
            include: ['roles']
        });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        const hasAdminRole = user.roles.some(role => role.name === 'admin');
        
        if (hasAdminRole) {
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

const isCoordinator = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId, {
            include: ['roles']
        });
        
        const hasCoordinatorRole = user.roles.some(role => role.name === 'coordinator');
        
        if (hasCoordinatorRole) {
            return next();
        }

        res.status(403).json({
            success: false,
            message: "Se requiere rol de coordinador"
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
    isAdmin,
    isCoordinator
};