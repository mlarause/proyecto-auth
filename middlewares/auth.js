const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // 1. Obtener token de múltiples fuentes
  const token = req.headers['x-access-token'] || 
                req.headers['authorization']?.split(' ')[1] || 
                req.body.token;
  
  // 2. Verificar existencia del token
  if (!token) {
    console.error("No token provided in request");
    return res.status(403).json({ message: "No se proporcionó token" });
  }

  try {
    // 3. Verificar y decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Adjuntar información de usuario al request
    req.user = {
      id: decoded._id,
      role: decoded.role || decoded.rol // Compatibilidad con ambas versiones
    };
    
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ 
      message: "Token inválido o expirado",
      error: error.message 
    });
  }
};

module.exports = verifyToken;