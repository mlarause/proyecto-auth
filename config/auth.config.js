module.exports = {
  secret: process.env.JWT_SECRET || "tusecretoparalostokens",
  expiresIn: "24h" // 24 horas en segundos
};