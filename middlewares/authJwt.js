const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

exports.verifyToken = (req, res, next) => {
    // Obtener token de los headers (compatible con diferentes formatos)
    const token = req.headers['x-access-token'] || 
                 req.headers['authorization'] || 
                 req.headers['token'];
    
    if (!token) {
        return res.status(403).json({ 
            success: false,
            message: "Token de autenticación no proporcionado" 
        });
    }

    // Extraer solo el token si viene como Bearer
    const tokenOnly = token.replace(/^Bearer\s+/i, '');

    jwt.verify(tokenOnly, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ 
                success: false,
                message: "Token inválido o expirado",
                error: err.message 
            });
        }
        
        // Adjuntar información del usuario al request
        req.userId = decoded.id;
        next();
    });
};

exports.isAdmin = async (req, res, next) => {
    try {
        const user = await db.User.findByPk(req.userId, {
            include: [db.Role]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        const isAdmin = user.Roles.some(role => role.name === 'admin');
        if (isAdmin) {
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

exports.isCoordinator = async (req, res, next) => {
    try {
        const user = await db.User.findByPk(req.userId, {
            include: [db.Role]
        });

        const isCoordinator = user.Roles.some(role => role.name === 'coordinator');
        if (isCoordinator) {
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