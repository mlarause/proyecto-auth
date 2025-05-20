const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;

const verifyToken = (req, res, next) => {
    // Obtener token de Authorization header o x-access-token
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    
    if (!token) {
        return res.status(403).json({ 
            success: false,
            message: "No se proporcionó token de autenticación" 
        });
    }

    // Extraer token si viene como Bearer token
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    jwt.verify(token, config.secret, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ 
                success: false,
                message: "Token inválido o expirado" 
            });
        }
        
        // Verificar que el usuario existe
        try {
            const user = await User.findByPk(decoded.id, {
                include: ['roles']
            });
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Usuario no encontrado"
                });
            }

            // Adjuntar información del usuario al request
            req.userId = decoded.id;
            req.userRoles = user.roles.map(role => role.name);
            
            next();
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error al verificar usuario"
            });
        }
    });
};

const isAdmin = (req, res, next) => {
    if (req.userRoles && req.userRoles.includes('admin')) {
        return next();
    }
    res.status(403).json({
        success: false,
        message: "Se requiere rol de administrador"
    });
};

const isCoordinator = (req, res, next) => {
    if (req.userRoles && req.userRoles.includes('coordinator')) {
        return next();
    }
    res.status(403).json({
        success: false,
        message: "Se requiere rol de coordinador"
    });
};

module.exports = {
    verifyToken,
    isAdmin,
    isCoordinator
};