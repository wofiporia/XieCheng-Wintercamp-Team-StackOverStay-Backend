const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(require('./middlewares/requestLogger'));

const routes = require('./routes');
app.use('/api', routes);

// 404
app.use(require('./middlewares/notFound'));

// Error handler
app.use(require('./middlewares/errorHandler'));

module.exports = app;
