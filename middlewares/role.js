function checkRole(allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Acceso denegado: permisos insuficientes' 
      });
    }
    next();
  };
}

module.exports = { checkRole };