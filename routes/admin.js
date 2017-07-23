'use strict';

const express = require('express');
const router = express.Router();
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

    knex('events').select('*').where('event_code', eventid).then((rows) => {
      if (rows[0].deleted_at !== null) {
        return Promise.reject(new Error());
      }
    }).then(() => {
      if (adminid.length < 8 || eventid.length < 8) {
        return Promise.reject(new Error('Invalid URL'));
      }
    }).then(() => {
      res.render('event', templateVars);
    }).catch((err) => {
      res.status(404).send('Page doesn\'t exist!');
    });
  });

  // POST update 'deleted_at' from null to timestamp
  router.post('/event/:event_code/:admin_code/delete', (req, res) => {
    const eventid = req.params.event_code;
    const adminid = req.params.admin_code;


    knex('events').select(1).where('event_code', eventid).then((rows) => {
      if (!rows.length) {
        throw new Error('This event doesn\'t exist!');
      }
    }).then(() => {
      return knex('events').select('*').where('event_code', eventid).then((rows) => {
        if (rows[0].deleted_at !== null) {
          return Promise.reject(new Error('Event was deleted'));
        }
      }).then(() => {
        return knex('events').where('event_code', eventid).update({
          deleted_at: new Date()
        });
      }).then(() => {
        res.redirect('/');
      }).catch(() => {
        res.status(404).send('Page doesn\'t exist!');
      });
    });
  });
  return router;
};