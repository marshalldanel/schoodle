'use strict';

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || 'development';
const express     = require('express');
const bodyParser  = require('body-parser');
const sass        = require('node-sass-middleware');
const app         = express();

const knexConfig  = require('./knexfile');
const knex        = require('knex')(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

const randStr     = require('./public/scripts/makeCode');

// Seperated Routes for each Resource
// const usersRoutes = require('./routes/users');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/styles', sass({
  src: __dirname + '/styles',
  dest: __dirname + '/public/styles',
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static('public'));

// Mount all resource routes
// app.use('/event/new', usersRoutes(knex));

// Create new event page
app.get('/event/new', (req, res) => {
  res.render('new');
});

// POST event/admin data to db
app.post('/event', (req, res) => {
  let randCode = randStr();
  knex.transaction(() => {
    return knex('admins')
      .insert({
        name: req.body.admin_name,
        email: req.body.admin_email,
        admin_code: randCode
      })
      .returning('*')
      .then(([admin]) => {
        return knex('events')
          .insert({
            title: req.body.title,
            location: req.body.location,
            description: req.body.description,
            event_date: req.body.date,
            event_code: randCode,
            admin_id: admin.id
          });
      })
      .then(function () {
        res.json({ success: true, message: 'ok' });
      });
  });
});

// Home page
app.get('/', (req, res) => {
  res.render('index');
});

app.listen(PORT, () => {
  console.log('Example app listening on port', PORT);
});