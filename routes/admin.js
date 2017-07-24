'use strict';

const express = require('express');
const randStr = require('../public/scripts/make-code');
const router = express.Router();

module.exports = (knex) => {

  // Event dashboard
  router.get('/event/:eventCode/:adminCode/admin', (req, res) => {
    const eventid = req.params.eventCode;
    const adminid = req.params.adminCode;
    const templateVars = {
      adminid,
      eventid
    };

    // Select event details
    knex('events').select('*').where('event_code', eventid).then((rows) => {
      if (rows[0].deleted_at) {
        return Promise.reject(new Error('This event has been deleted!'));
      }

    // Guard code
    }).then(() => {
      if (adminid.length < 8 || eventid.length < 8) {
        return Promise.reject(new Error('Invalid URL'));
      }

    }).then(() => {
      res.render('event', templateVars);

    }).catch((error) => {
      res.render('error', {message: error.message, status: error.status});
    });
  });

  // Delete event
  router.post('/event/:eventCode/:adminCode/delete', (req, res) => {
    const eventid = req.params.eventCode;
    const adminid = req.params.adminCode;

    // Guard code: check if event exists
    knex('events').select(1).where('event_code', eventid).then((rows) => {
      if (!rows.length) {
        throw new Error('This event does not exist');
      }

    }).then(() => {

      // Guard code: check if event was already deleted
      return knex('events').select('*').where('event_code', eventid).then((rows) => {
        if (rows[0].deleted_at) {
          return Promise.reject(new Error('This event has already been deleted'));
        }
      }).then(() => {

        // Delete event
        return knex('events').where('event_code', eventid).update({
          deleted_at: new Date()
        });

      }).then(() => {
        res.redirect('/');

      }).catch((error) => {
        res.render('error', {message: error.message, status: error.status});
      });
    });
  });
  
  return router;
};
