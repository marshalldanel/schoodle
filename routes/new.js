"use strict";

const express = require('express');
const router  = express.Router();
const randStr = require('../public/scripts/makeCode');

module.exports = (knex) => {

  router.get('/event/new', (req, res) => {
    res.render('new');
  });

  router.post('/event/new', (req, res) => {
    let randAdmin = randStr();
    let randEvent = randStr();
    knex.transaction(() => {
      return knex('admins')
        .insert({
          name: req.body.admin_name,
          email: req.body.admin_email,
          admin_code: randAdmin
        })
        .returning('*')
        .then(([admin]) => {
          return knex('events')
            .insert({
              title: req.body.title,
              location: req.body.location,
              description: req.body.description,
              event_date: req.body.date,
              event_code: randEvent,
              admin_id: admin.id
            });
        })
        .then(() => {
          res.redirect(`/event/${randEvent}/${randAdmin}/admin`);
        });
    });
  });

  return router;
};
