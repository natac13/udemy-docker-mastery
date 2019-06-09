const express = require('express');
const Redis = require('ioredis');
const morgan = require('morgan');
/* Node env */

// require('dotenv').config();

const redis = new Redis({
  host: process.env.REDIS_HOST,
  post: process.env.REDIS_PORT,
});

const app = express();
app.use(morgan('dev'));

const port = process.env.PORT || 3000;

const host = process.env.HOST || '0.0.0.0';

app.use('/*', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Hello World' });
});

app.listen(port, host, () => {
  console.log(`App 🏃 on http://${host}:${port}`);
});
