module.exports = {
  secret: process.env.JWT_SECRET || 'tu_clave_secreta_para_desarrollo',
  jwtExpiration: process.env.JWT_EXPIRE || '24h' // Ej: 3600 (1h), "2 days", "10h"
};