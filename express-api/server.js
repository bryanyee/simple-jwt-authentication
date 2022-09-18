const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send('Welcome to port 3000!');
})

app.use((req, res) => {
  res.status(404).send('Not found.');
});

app.listen(3000, () => console.log('Listening on port 3000.'));
