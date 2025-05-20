const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

// Middleware para verificar token JWT
verifyToken = (req, res, next) => {
    // Obtener token de headers (compatible con Authorization y x-access-token)
    let token = req.headers["authorization"] || req.headers["x-access-token"];
    
    if (!token) {
        return res.status(403).send({
            success: false,
            message: "No se proporcionó token de autenticación"
        });
    }

    // Eliminar 'Bearer ' si está presente
    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
    }

    // Verificar token
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            // Manejo específico de errores
            if (err.name === "TokenExpiredError") {
                return res.status(401).send({
                    success: false,
                    message: "Token expirado, por favor inicie sesión nuevamente"
                });
            }
            return res.status(401).send({
                success: false,
                message: "Token inválido"
            });
        }
        
        // Token válido, agregar userId al request
        req.userId = decoded.id;
        next();
    });
};

// Middleware para verificar rol de administrador
isAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "admin") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                success: false,
                message: "Se requiere rol de administrador"
            });
        }).catch(err => {
            res.status(500).send({
                success: false,
                message: "Error al verificar roles del usuario"
            });
        });
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: "Error al buscar usuario"
        });
    });
};

// Middleware para verificar rol de moderador
isModerator = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "moderator") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                success: false,
                message: "Se requiere rol de moderador"
            });
        }).catch(err => {
            res.status(500).send({
                success: false,
                message: "Error al verificar roles del usuario"
            });
        });
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: "Error al buscar usuario"
        });
    });
};

// Middleware para verificar rol de moderador o administrador
isModeratorOrAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "moderator") {
                    next();
                    return;
                }

                if (roles[i].name === "admin") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                success: false,
                message: "Se requiere rol de administrador o moderador"
            });
        }).catch(err => {
            res.status(500).send({
                success: false,
                message: "Error al verificar roles del usuario"
            });
        });
    }).catch(err => {
        res.status(500).send({
            success: false,
            message: "Error al buscar usuario"
        });
    });
};

// Exportar middlewares
const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isModerator: isModerator,
    isModeratorOrAdmin: isModeratorOrAdmin
};

module.exports = authJwt;