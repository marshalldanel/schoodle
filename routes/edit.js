'use strict';

const express = require('express');
const router  = express.Router();
const randStr = require('../public/scripts/makeCode');
const moment  = require('moment');

module.exports = (knex) => {

  router.get('/event/:event_code/:admin_code/edit', (req, res) => {
    let admin_code_b = req.params.admin_code;
    let event_code_b = req.params.event_code;

    return knex('admins').select(1).where('admin_code', admin_code_b).then((rows) => {
      if (!rows.length) {
        throw new Error('This admin doesn\'t exist!');
      }
    }).then(() => {
      return knex('events').select('*').where('event_code', event_code_b).then((rows) => {
        if (rows[0].deleted_at !== null) {
          return Promise.reject(err);
        }
      }).then(() => {
        return knex('events').select()
          .join('admins', 'admin_id', '=', "admins.id")
          .where('event_code', event_code_b)
          .where('admin_code', admin_code_b)
          .then((rows) => {
            if(!rows.length) {
              return Promise.reject(new Error('This event and admin do not match!'));
            }
          });
      }).then(() => {
        return knex('events').select().where('event_code', event_code_b)
          .join('times', 'event_id', '=', 'id').join('admins', 'admin_id', '=', "admins.id");
      }).then((rows) => {
        if (rows.length) {
          rows[0].event_date = moment(rows[0].event_date).format('YYYY-MM-DD');
          res.render('edit', { event: rows[0]});
        } else {
          return Promise.reject(new Error('This event doesn\'t exist!'));
        }
      }).catch((err) => {
        res.status(404).send('Error 404: Doesn\'t exist');
      });
    });
  });

  router.post('/event/:event_code/:admin_code/edit', (req, res) => {
    let admin_code = req.params.admin_code;
    let event_code = req.params.event_code;
    knex.transaction(() => {
      return (
        knex('events').where('event_code', req.params.event_code)
        .update({
          title: req.body.title,
          location: req.body.location,
          description: req.body.description,
          event_date: req.body.date
        })
        .then(() => {
          return knex('times').join('events', 'event_id', '=', 'id')
            .update({
              time1: req.body.time1,
              time2: req.body.time2,
              time3: req.body.time3,
              time4: req.body.time4
            });
        })
        .then(() => {
          res.redirect(`/event/${event_code}/${admin_code}/admin`);
        }).catch((err) => {
          console.log(err);
          res.status(404).send(err);
        })
      ); // return
    });

  });
  return router;
};

