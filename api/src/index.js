const express = require('express');
const postgres = require('./postgres')

postgres.setup()

// Constants
const PORT = process.env.API_PORT
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send(JSON.stringify({
    msg: "Hello World"
  }));
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
