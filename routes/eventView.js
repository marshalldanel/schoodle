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

  // POST update 'deleted_at' from null to timestamp
  router.post('/event/:event_code/:admin_code/delete', (req, res) => {
    const eventid = req.params.event_code;
    const adminid = req.params.admin_code;
    
    knex('events').select(1).where('event_code', eventid).then((rows) => {
      if (!rows.length) {
        console.log('first error');
        throw new Error('This event doesn\'t exist!');
      }
    }).then(() => {
      return knex('events').select('*').where('event_code', eventid).then((rows) => {
        if (rows[0].deleted_at !== null) {
          return Promise.reject(err);
        }
      }).then(() => {
        return knex('events').where('event_code', eventid).update({deleted_at: new Date});
      }).then(() => {
        res.redirect('/');
      }).catch(() => {
        res.status(404).send('Error 404: Doesn\'t exist');
      });
    });
  });
  return router;
};