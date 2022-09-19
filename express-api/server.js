const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const { loadDatastore } = require('./datastore.js');
const { User } = require('./models.js');
const { authenticateUsernameAndPassword, authenticateToken, prepareHashedPassword, generateAccessToken } = require('./authentication.js');

const app = express();
dotenv.config();
loadDatastore();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // content-type: application/x-www-form-urlencoded 

app.get('/', (_req, res) => {
  return res.status(200).send('Welcome to port 3000!');
});

app.post('/authenticate', authenticateUsernameAndPassword, (req, res) => {
  const token = generateAccessToken(req.body.username);
  return res.status(200).json(token);
});

app.get('/profile', authenticateToken, (req, res) => {
  const data = req.currentUser.toObject();
  return res.status(200).json(data);
});

app.post('/users/create', prepareHashedPassword, (req, res) => {
  const { username, birthdate } = req.body;
  const { passwordHash } = req;
  try {
    const user = User.create({ username, birthdate, password: passwordHash });
    const data = {
      ...user.toObject(),
      token: generateAccessToken(username),
    }
    return res.status(200).json(data);
  } catch (e) {
    if (e.message === 'usernameAlreadyExists') {
      return res.status(409).send('User already exists for username.');
    } else {
      return res.status(400).send(e.message);
    }
  }
});

app.use((_req, res) => {
  return res.status(404).send('Not found.');
});

app.listen(3000, () => console.log('Listening on port 3000.'));
