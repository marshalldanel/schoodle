"use strict";

const express = require('express');
const randStr = require('../public/scripts/make-code');
const router = express.Router();

module.exports = (knex) => {

  // New event page
  router.get('/event/new', (req, res) => {
    res.render('new');
  });

  // Create a new event
  router.post('/event/new', (req, res) => {
    let randAdmin = randStr();
    let randEvent = randStr();

    // Guard code
    if (!req.body.title) {
      res.render('error', {message: 'Must include a title for your event', status: 401});
    } else if (!req.body.admin_name || !req.body.admin_email) {
      res.render('error', {message: 'Must include name and email', status: 401});
    } else if (!req.body.date || !req.body.time1) {
      res.render('error', {message: 'Must include at least one date and one time', status: 401});
      return;
    }

    // Save event to database
    knex.transaction(() => {

      // Save admin details into admins database
      return knex('admins')
        .insert({
          name: req.body.admin_name,
          email: req.body.admin_email,
          admin_code: randAdmin
        })
        .returning('*')
        .then(([admin]) => {

          // Save event details into events database
          return knex('events')
            .insert({
              title: req.body.title,
              location: req.body.location,
              description: req.body.description,
              event_date: req.body.date,
              event_code: randEvent,
              admin_id: admin.id
            })
            .returning('*')
            .then(([event]) => {

              // Save time details into times database
              return knex('times')
                .insert({
                  time1: req.body.time1,
                  time2: req.body.time2,
                  time3: req.body.time3,
                  time4: req.body.time4,
                  event_id: event.id
                });
            });
        })

        .then(() => {
          res.redirect(`/event/${randEvent}/${randAdmin}/admin`);
        })

        .catch((error) => {
          res.render('error', {message: error.message, status: error.status});
        });
    });
  });

  return router;
};
