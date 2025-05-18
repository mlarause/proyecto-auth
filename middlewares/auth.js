const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Obtener token de Authorization: Bearer o de x-access-token
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1] || req.headers['x-access-token'];
  
  if (!token) {
    return res.status(403).json({ message: "No se proporcionó token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded._id;
    req.userRole = decoded.rol;
    next();
  } catch (err) {
    console.error("Error verificando token:", err);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = verifyToken;