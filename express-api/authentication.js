const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { User } = require('./models.js');

const SALT_ROUNDS = 10; // Currently ~ 10 hashes / sec

function authenticateUsernameAndPassword(req, res, next) {
  const { username, password } = req.body;
  const user = User.find({ username });
  if (!user) {
    return res.status(401).send('Invalid username or password.');;
  }
  const userPasswordhash = user.password;
  bcrypt.compare(password, userPasswordhash, function(err, result) {
    if (!result) {
      return res.status(401).send('Invalid username or password.');
    }
    if (err) {
      console.error(`Bcrypt comparison error: ${err.message}`);
      return res.status(500).send('Problem authenticating.');
    }
    next();
  });
}

function prepareHashedPassword(req, res, next) {
  const { password } = req.body;
  bcrypt.hash(password, SALT_ROUNDS, function(err, passwordHash) {
    if (err) {
      console.error(`Bcrypt hashing error: ${err.message}`);
      return res.status(500).send('Problem saving password.');
    }
    req.passwordHash = passwordHash;
    next();
  });
}

function generateAccessToken(username) {
  return jwt.sign({ username, role: 'user' }, process.env.TOKEN_SECRET, { expiresIn: 120 }); // 120 seconds
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send('Missing token.');
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
  prepareHashedPassword,
};
