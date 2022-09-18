const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const { authenticateUsernameAndPassword, authenticateToken, generateAccessToken } = require('./authentication.js');

const app = express();
dotenv.config();

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

app.get('/api/admin', authenticateToken, (req, res) => {
  const data = {
    username: req.userProfile.username,
    role: req.userProfile.role,
  };
  res.status(200).json(data);
});

app.use((req, res) => {
  res.status(404).send('Not found.');
});

app.listen(3000, () => console.log('Listening on port 3000.'));
