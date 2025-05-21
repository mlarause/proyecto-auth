const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No se proporcionó token!" });
  }

  jwt.verify(token, config.secret, async (err, decoded) => {
    if (err) {
      return res.status(401).send({
        success: false,
        message: "Token inválido o expirado"
      });
    }
    
    try {
      // Cambio crucial aquí: findByPk -> findById (Mongoose)
      const user = await User.findById(decoded.id).exec();
      
      if (!user) {
        return res.status(404).send({ message: "Usuario no encontrado." });
      }
      
      req.userId = decoded.id;
      next();
    } catch (error) {
      return res.status(500).send({ message: "Error al verificar usuario" });
    }
  });
};

isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).exec();
    const roles = await db.role.find({ _id: { $in: user.roles } });

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        return next();
      }
    }

    res.status(403).send({ message: "Requiere rol de Administrador!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const authJwt = {
  verifyToken,
  isAdmin
};

module.exports = authJwt;