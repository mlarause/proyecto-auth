const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1] || req.headers['x-access-token'];
    
    if (!token) {
        return res.status(403).json({ 
            success: false, 
            message: 'No token provided' 
        });
    }

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ 
                success: false, 
                message: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
                expiredAt: err.expiredAt
            });
        }
        req.user = decoded;
        next();
    });
};

const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
    return;
  }

  res.status(403).send({
    success: false,
    message: "Require Admin Role!"
  });
};

const isCoordinator = (req, res, next) => {
  if (req.user.role === "coordinator") {
    next();
    return;
  }

  res.status(403).send({
    success: false,
    message: "Require Coordinator Role!"
  });
};

const isAssistant = (req, res, next) => {
  if (req.user.role === "assistant") {
    next();
    return;
  }

  res.status(403).send({
    success: false,
    message: "Require Assistant Role!"
  });
};

exports.verifyRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `Requires one of: ${allowedRoles.join(', ')}` 
            });
        }
        next();
    };
};

// Función específica para proveedores (suppliers)
const verifySupplierToken = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  
  if (!token) {
    return res.status(403).send({
      success: false,
      message: "No token provided!"
    });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), config.jwtSecret);
    
    if (decoded.role !== 'supplier') {
      return res.status(403).send({
        success: false,
        message: "Invalid token for supplier"
      });
    }
    
    req.supplier = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).send({
        success: false,
        message: "Supplier token expired",
        expiredAt: err.expiredAt
      });
    }
    return res.status(401).send({
      success: false,
      message: "Unauthorized supplier token!"
    });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  isCoordinator,
  isAssistant,
  verifyRole,
  verifySupplierToken
};