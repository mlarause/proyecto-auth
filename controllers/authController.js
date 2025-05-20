const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
// Eliminamos la línea que causa el error: const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Validación básica
  if (!req.body.username || !req.body.email || !req.body.password) {
    return res.status(400).send({
      success: false,
      message: "Todos los campos son requeridos (usuario, email, contraseña)"
    });
  }

  // Crear usuario
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      // Asignar rol (por defecto "user" si no se especifica)
      const roleName = req.body.role || "user";
      
      Role.findOne({
        where: {
          name: roleName
        }
      }).then(role => {
        if (!role) {
          return res.status(404).send({
            success: false,
            message: "Rol no encontrado"
          });
        }

        user.setRoles([role.id]).then(() => {
          res.send({
            success: true,
            message: "Usuario registrado exitosamente"
          });
        });
      }).catch(err => {
        res.status(500).send({
          success: false,
          message: err.message || "Error al asignar rol al usuario"
        });
      });
    })
    .catch(err => {
      res.status(500).send({
        success: false,
        message: err.message || "Error al crear el usuario"
      });
    });
};

exports.signin = (req, res) => {
  // Validación básica
  if (!req.body.username || !req.body.password) {
    return res.status(400).send({
      success: false,
      message: "Usuario y contraseña son requeridos"
    });
  }

  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Usuario no encontrado"
        });
      }

      // Verificar contraseña
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          success: false,
          accessToken: null,
          message: "Contraseña incorrecta"
        });
      }

      // Generar token (24 horas de validez)
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 horas
      });

      // Obtener roles del usuario
      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        // Respuesta exitosa
        res.status(200).send({
          success: true,
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({
        success: false,
        message: "Error en el servidor: " + err.message
      });
    });
};

exports.verifyToken = (req, res) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      success: false,
      message: "No se proporcionó token"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        success: false,
        message: "Token inválido"
      });
    }
    
    res.status(200).send({
      success: true,
      message: "Token válido"
    });
  });
};

exports.adminBoard = (req, res) => {
  res.status(200).send({
    success: true,
    message: "Contenido de Administrador"
  });
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send({
    success: true,
    message: "Contenido de Moderador"
  });
};

exports.userBoard = (req, res) => {
  res.status(200).send({
    success: true,
    message: "Contenido de Usuario"
  });
};