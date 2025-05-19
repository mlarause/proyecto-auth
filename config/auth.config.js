module.exports = {
  secret: process.env.JWT_SECRET || "tusecretoparalostokens",
  expiresIn: 86400 // 24 horas en segundos
};