const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");

// Diagnóstico: Verificar conexión a la base de datos
console.log("[DIAGNÓSTICO] Modelos disponibles:", Object.keys(db));

exports.verifyToken = async (req, res, next) => {
    try {
        // Verificar token
        const token = req.headers['authorization']?.split(' ')[1] || req.headers['x-access-token'];
        
        if (!token) {
            console.log("[DIAGNÓSTICO] Token no proporcionado");
            return res.status(403).json({ 
                success: false,
                message: "Token no proporcionado" 
            });
        }

        // Verificar y decodificar token
        const decoded = jwt.verify(token, config.secret);
        console.log("[DIAGNÓSTICO] Token decodificado:", decoded);

        // Verificar que el modelo User existe
        if (!db.User) {
            console.error("[DIAGNÓSTICO] Error: Modelo User no encontrado en db");
            return res.status(500).json({
                success: false,
                message: "Error de configuración del servidor"
            });
        }

        // Buscar usuario con roles
        const user = await db.User.findByPk(decoded.id, {
            include: [{
                model: db.Role,
                through: { attributes: [] }
            }]
        });

        if (!user) {
            console.log("[DIAGNÓSTICO] Usuario no encontrado para ID:", decoded.id);
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        // Adjuntar información al request
        req.userId = decoded.id;
        req.userRoles = user.Roles.map(role => role.name);
        
        console.log("[DIAGNÓSTICO] Autenticación exitosa para usuario:", user.id);
        next();
    } catch (error) {
        console.error("[DIAGNÓSTICO] Error en verifyToken:", error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: "Token expirado",
                error: error.message 
            });
        }
        res.status(401).json({ 
            success: false,
            message: "Token inválido",
            error: error.message 
        });
    }
};

exports.isAdmin = (req, res, next) => {
    if (!req.userRoles) {
        console.error("[DIAGNÓSTICO] userRoles no definido");
        return res.status(403).json({
            success: false,
            message: "Acceso no autorizado"
        });
    }

    if (req.userRoles.includes('admin')) {
        return next();
    }
    
    console.log("[DIAGNÓSTICO] Intento de acceso sin rol admin. Roles:", req.userRoles);
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