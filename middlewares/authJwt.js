const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1] || 
                 req.headers['x-access-token'];
    
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
                message: "Token inválido o expirado",
                error: err.message 
            });
        }
        
        req.userId = decoded.id;
        next();
    });
};

exports.isAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId, {
            include: [db.Role]
        });

        const isAdmin = user.Roles.some(role => role.name === 'admin');
        if (isAdmin) return next();
        
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

exports.isCoordinator = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId, {
            include: [db.Role]
        });

        const isCoordinator = user.Roles.some(role => role.name === 'coordinator');
        if (isCoordinator) return next();
        
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