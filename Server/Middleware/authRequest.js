const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    console.log('No token found in the request headers.');
    return res.sendStatus(401); 
  }

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      console.error('Error verifying token:', err.message);
      return res.sendStatus(403); 
    }
    console.log('Token verified successfully. User:', user);
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
