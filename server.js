'use strict';

// Environmental Variables
require('dotenv').config();
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || 'development';

// Dependencies
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const express = require('express');
const flash = require('connect-flash');
const knexConfig = require('./knexfile');
const knexLogger = require('knex-logger');
const knex = require('knex')(knexConfig[ENV]);
const morgan = require('morgan');
const sass = require('node-sass-middleware');

const app = express();

// Seperated Routes
const adminRoutes = require('./routes/admin');
const editRoutes = require('./routes/edit');
const newRoutes = require('./routes/new');
const pollRoutes = require('./routes/poll');

app.use(morgan('dev'));
app.use(knexLogger(knex));
app.use(cookieSession({
  secret: process.env.SESSION_SECRET || 'development'
}));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use('/styles', sass({
  src: __dirname + '/styles',
  dest: __dirname + '/public/styles',
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Mount Routes
app.use('/', adminRoutes(knex));
app.use('/', editRoutes(knex));
app.use('/', newRoutes(knex));
app.use('/', pollRoutes(knex));

// Home Page
app.get('/', (req, res) => {
  res.render('index');
});

// Listen
app.listen(PORT, () => {
  console.log('Schoodle listening on port', PORT);
});
