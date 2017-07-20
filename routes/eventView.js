'use strict';

const express = require('express');
const router  = express.Router();
const randStr = require('../public/scripts/makeCode');

module.exports = (knex) => {

  // GET view event page
  router.get('/event/:event_code/:admin_code/admin', (req, res) => {
    const eventid = req.params.event_code;
    const adminid = req.params.admin_code;
    const templateVars = {
      adminid,
      eventid
    };
    if (adminid.length < 8 || eventid.length < 8) {
      res.status(404).send('Error 404 - Page not found');
    } else {
      res.render('event', templateVars);
    }
  });

  return router;
};



// POST edit event
// app.post('/event/:longid/edit', (req, res) => {
//   const longid = req.params.longid;
//   const adminid = longid.substr(0, 8);
//   const eventid = longid.substr(8, 8);
// });

// POST delete event
// app.post('/event/:longid/delete', (req, res) => {
//   const longid = req.params.longid;
//   const adminid = longid.substr(0, 8);
//   const eventid = longid.substr(8, 8);
// });
