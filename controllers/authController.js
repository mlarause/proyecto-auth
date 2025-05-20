const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    // Validar campos requeridos
    if (!req.body.username || !req.body.email || !req.body.password) {
      return res.status(400).send({
        success: false,
        message: "Todos los campos son requeridos (usuario, email, contraseña)"
      });
    }

    // Crear usuario
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    });

    // Asignar rol (user por defecto si no se especifica)
    const rolesToAssign = req.body.roles ? req.body.roles : ["user"];
    const roles = await Role.findAll({
      where: {
        name: {
          [Op.or]: rolesToAssign
        }
      }
    });

    await user.setRoles(roles);

    res.status(201).send({
      success: true,
      message: "Usuario registrado exitosamente"
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || "Error al registrar el usuario"
    });
  }
};

exports.signin = async (req, res) => {
  try {
    // Validación básica
    if (!req.body.username || !req.body.password) {
      return res.status(400).send({
        success: false,
        message: "Usuario y contraseña son requeridos"
      });
    }

    const user = await User.findOne({
      where: {
        username: req.body.username
      }
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    // Verificar contraseña
    const passwordIsValid = bcrypt.compareSync(
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

    // Obtener roles del usuario
    const roles = await user.getRoles();
    const authorities = roles.map(role => "ROLE_" + role.name.toUpperCase());

    // Generar token con expiración configurable
    const token = jwt.sign(
      { 
        id: user.id,
        username: user.username,
        roles: authorities 
      },
      config.secret,
      {
        expiresIn: config.jwtExpiration || 86400 // 24 horas por defecto
      }
    );

    // Respuesta exitosa
    res.status(200).send({
      success: true,
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error en el servidor: " + error.message
    });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).send({ 
      success: false,
      message: "Refresh Token es requerido" 
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, config.secret);
    
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).send({ 
        success: false,
        message: "Usuario no encontrado" 
      });
    }

    // Generar nuevo token de acceso
    const newToken = jwt.sign(
      { id: user.id },
      config.secret,
      { expiresIn: config.jwtExpiration || 86400 }
    );

    res.status(200).send({
      success: true,
      accessToken: newToken
    });

  } catch (error) {
    res.status(401).send({ 
      success: false,
      message: "Refresh Token inválido o expirado" 
    });
  }
};

// Métodos de tablero (se mantienen igual)
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