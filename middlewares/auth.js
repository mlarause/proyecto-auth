const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../config/auth.config');

const verifyToken = (req, res, next) => {
  // Extraer token de múltiples fuentes
  let token = req.headers['x-access-token'] || 
             req.cookies?.token ||
             req.body?.token;

  // Buscar token en Authorization header (Bearer)
  const authHeader = req.headers['authorization'];
  if (!token && authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1]; // Extraer el token después de "Bearer "
  }

  if (!token) {
    console.error('Token no encontrado. Headers recibidos:', req.headers);
    return res.status(403).json({ 
      success: false, 
      message: 'Token no proporcionado' 
    });
  }

  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    console.error('Error al verificar token:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Token inválido o expirado' 
    });
  }
};

// ... (mantener tus otras funciones isAdmin, isCoordinador, etc.)

module.exports = {
  verifyToken,
  isAdmin,
  isCoordinador,
  isAuxiliar
};