const jwt = require('jsonwebtoken');

const { User } = require('./models.js');

function authenticateUsernameAndPassword(username, password) {
  const user = User.find({ username, password });
  return Boolean(user);
}

function generateAccessToken(username) {
  return jwt.sign({ username, role: 'user' }, process.env.TOKEN_SECRET, { expiresIn: 120 }); // 120 seconds
}


function authenticateToken(req, res, next) {
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
    const user = User.find({ username: payload.username });
    req.currentUser = user;
    next();
  });
}

module.exports = {
  authenticateUsernameAndPassword,
  authenticateToken,
  generateAccessToken,
};
