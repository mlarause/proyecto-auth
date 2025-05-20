const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

exports.verifyToken = (req, res, next) => {
    // Aceptar token en Authorization header (Bearer) o x-access-token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1] || req.headers['x-access-token'];
    
    if (!token) {
        return res.status(403).json({ 
            success: false,
            message: "Token de autenticación no proporcionado" 
        });
    }

    jwt.verify(token, config.secret, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ 
                success: false,
                message: "Token inválido o expirado",
                error: err.message 
            });
        }
        
        // Verificar que el usuario existe
        try {
            const user = await User.findByPk(decoded.id, {
                include: [db.Role]
            });
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Usuario no encontrado"
                });
            }

            // Adjuntar información del usuario al request
            req.userId = decoded.id;
            req.userRoles = user.Roles.map(role => role.name);
            
            next();
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error al verificar usuario"
            });
        }
    });
};

exports.isAdmin = (req, res, next) => {
    if (req.userRoles && req.userRoles.includes('admin')) {
        return next();
    }
    res.status(403).json({
        success: false,
        message: "Se requiere rol de administrador"
    });
};

exports.isCoordinator = (req, res, next) => {
    if (req.userRoles && req.userRoles.includes('coordinator')) {
        return next();
    }
    res.status(403).json({
        success: false,
        message: "Se requiere rol de coordinador"
    });
};