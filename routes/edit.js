'use strict';

const express = require('express');
const moment = require('moment');
const randStr = require('../public/scripts/make-code');
const router = express.Router();

module.exports = (knex) => {

  // Edit event page
  router.get('/event/:eventCode/:adminCode/edit', (req, res) => {
    let adminCode = req.params.adminCode;
    let eventCode = req.params.eventCode;

    // Guard code: check if admin exists
    return knex('admins').select(1).where('admin_code', adminCode).then((rows) => {
      if (!rows.length) {
        throw new Error('This admin does not exist!');
      }
    }).then(() => {

      // Guard code: check if event has been deleted
      return knex('events').select('*').where('event_code', eventCode).then((rows) => {
        if (rows[0].deleted_at) {
          return Promise.reject(new Error('This event has been deleted!'));
        }
      }).then(() => {

        // Select event details
        return knex('events').select()
          .join('admins', 'admin_id', '=', 'admins.id')
          .where('event_code', eventCode)
          .where('admin_code', adminCode)
          .then((rows) => {

            // Guard code: check if event and admin code match
            if (!rows.length) {
              return Promise.reject(new Error('This event and admin do not match!'));
            }
          });
      }).then(() => {

        // Select event details
        return knex('events').select().where('event_code', eventCode)
          .join('times', 'event_id', '=', 'id').join('admins', 'admin_id', '=', 'admins.id');
      }).then((rows) => {

        // Render edit page
        if (rows.length) {
          rows[0].event_date = moment(rows[0].event_date).format('YYYY-MM-DD');
          res.render('edit', {
            event: rows[0]
          });
        } else {
          return Promise.reject(new Error('This event does not exist!'));
        }

      }).catch((error) => {
        res.status(500).send(error.message);
      });
    });
  });

  // Edit event
  router.post('/event/:eventCode/:adminCode/edit', (req, res) => {
    let adminCode = req.params.adminCode;
    let eventCode = req.params.eventCode;

    // Update event details
    knex.transaction(() => {
      return knex('events').where('event_code', req.params.eventCode)
        .update({
          title: req.body.title,
          location: req.body.location,
          description: req.body.description,
          event_date: req.body.date
        })
        .then(() => {

          // Update times
          return knex('times').join('events', 'event_id', '=', 'id')
            .update({
              time1: req.body.time1,
              time2: req.body.time2,
              time3: req.body.time3,
              time4: req.body.time4
            });
        })

        .then(() => {
          res.redirect(`/event/${eventCode}/${adminCode}/admin`);

        }).catch((error) => {
          res.status(500).send(error);
        });
    });
  });

  return router;
};
