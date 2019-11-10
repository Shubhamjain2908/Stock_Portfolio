'use strict';

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const promiseRouter = require('express-promise-router');

const keys = require('./config/keys');

require('./global_functions');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });
require('./models/Stock');
require('./models/Portfolio');
require('./models/Transaction');


const registerApi = require('./routes/api');
const router = promiseRouter();

const app = express()
  .use(morgan('dev'))
  .use(router)
  .set('json spaces', 2);
app.use(bodyParser.json());

app.use('/api', registerApi);

app.use('/', (req, res) => {
  res.statusCode = 404; //send the appropriate status code
  res.json({
    status: false,
    message: 'Sorry, API does not exist!',
    data: {},
    code: 404
  });
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(err.statusCode || err.status || 500).send(err.data || err.message || {});
  } else {
    next();
  }
});

// CORS
app.use(function (req, res, next) {
  // Website you wish to allow to connect

  res.setHeader('Access-Control-Allow-Origin', '*'); // Select this if you want to allow all website to access your App
  // Request headers & Methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization');

  // Set to true if you need the website to include cookies in the requests sent to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();

});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Portfolio app listening at port ${PORT}`);
});

module.exports = app;