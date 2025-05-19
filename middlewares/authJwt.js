const jwt = require('jsonwebtoken');
const config = require('../config');

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'No se proporcionó token'
        });
    }

    jwt.verify(token.replace('Bearer ', ''), config.SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

exports.isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Se requieren privilegios de administrador'
        });
    }
    next();
};