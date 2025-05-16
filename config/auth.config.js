module.exports = {
  secret: process.env.JWT_SECRET || "tu-clave-secreta-de-desarrollo",
  expiresIn: 86400 // 24 horas en segundos
};