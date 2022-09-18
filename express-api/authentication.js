const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

function authenticateUsernameAndPassword(username, password) {
  if (username === process.env.USERNAME && password === process.env.PASSWORD) {
    return true;
  }
  return false;
}

function generateAccessToken(username) {
  return jwt.sign({ username, role: 'admin' }, process.env.TOKEN_SECRET, { expiresIn: 120 }); // 120 seconds
}


function authenticateToken(req, res, next) {
  dotenv.config();
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).send('Login expired, please log in again.');
      } else {
        console.error(`Token verification error: ${err.message}`);
        return res.sendStatus(403);
      }
    }
    req.payload = payload;
    next();
  });
}

module.exports = {
  authenticateUsernameAndPassword,
  authenticateToken,
  generateAccessToken,
};
