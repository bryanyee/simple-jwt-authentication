const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const { loadDatastore } = require('./datastore.js');
const { User } = require('./models.js');
const { authenticateUsernameAndPassword, authenticateToken, generateAccessToken } = require('./authentication.js');

const app = express();
dotenv.config();
loadDatastore();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // content-type: application/x-www-form-urlencoded 

app.get('/', (req, res) => {
  res.status(200).send('Welcome to port 3000!');
});

app.post('/authenticate', (req, res) => {
  const { username, password } = req.body;
  const authenticated = authenticateUsernameAndPassword(username, password);
  if (authenticated) {
    const token = generateAccessToken(username);
    res.status(200).json(token);
  } else {
    res.status(401).send('Invalid username or password.');
  }
});

app.get('/profile', authenticateToken, (req, res) => {
  const data = req.currentUser.toObject();
  res.status(200).json(data);
});

app.post('/users/create', (req, res) => {
  const { username, password, birthdate } = req.body;
  let user;
  try {
    user = User.create({ username, password, birthdate });
  } catch (e) {
    if (e.message === 'usernameAlreadyExists') {
      res.status(409).send('User already exists for username.');
    } else {
      res.status(400).send(e.message);
    }
    return;
  }
  const data = {
    ...user.toObject(),
    token: generateAccessToken(username),
  }
  res.status(200).json(data);
});

app.use((req, res) => {
  res.status(404).send('Not found.');
});

app.listen(3000, () => console.log('Listening on port 3000.'));
