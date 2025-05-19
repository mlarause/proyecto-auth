const jwt = require('jsonwebtoken');
const config = require('../config');

exports.verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  
  if (!token) return res.status(403).json({ message: 'No token provided' });

  if (token.startsWith('Bearer ')) token = token.slice(7);

  jwt.verify(token, config.SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Require Admin Role' });
  }
  next();
};