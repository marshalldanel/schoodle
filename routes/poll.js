'use strict';

const express = require('express');
const router  = express.Router();
const randStr = require('../public/scripts/makeCode');

module.exports = (knex) => {

  // GET poll/invitation page (send to friends)
  router.get('/event/:eventid', (req, res) => {
    const templateVars = {
      eventname: 'Knife Party', // name of event from db
      times: ['12', '4', '5'], // array of available times
      votes: [[false, true, true]] // array containing each vote, which are also arrays
    };
    res.render('poll.ejs', templateVars);
  });

  return router;
};

