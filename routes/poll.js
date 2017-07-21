'use strict';

const express = require('express');
const router  = express.Router();
const randStr = require('../public/scripts/makeCode');

module.exports = (knex) => {

  // GET poll/invitation page (send to friends)
  router.get('/event/:eventid', (req, res) => {
    const templateVars = {
      eventname: 'Knife Party', // name of event from db
      eventdate: '2000-07-27',
      times: ['12:31', '04:11', '15:49', '19:12'], // array of available times
      votes: { 
        James: [true, false, true, false],
        Arnold: [false, false, true, true]
      } // object containing each vote, which are arrays
    };
    res.render('poll.ejs', templateVars);
  });

  return router;
};

