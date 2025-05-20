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

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ 
                success: false,
                message: "Token inválido o expirado" 
            });
        }
        
        // Almacenar información del usuario en el request
        req.userId = decoded.id;
        req.userRoles = decoded.roles; // Asumiendo que los roles vienen en el token
        next();
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