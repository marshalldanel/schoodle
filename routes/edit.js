'use strict';

const express = require('express');
const router  = express.Router();
const randStr = require('../public/scripts/makeCode');
const moment  = require('moment');

module.exports = (knex) => {

  router.get('/event/:event_code/:admin_code/edit', (req, res) => {
     let admin_code_b = req.params.admin_code;
     let event_code_b = req.params.event_code;

     knex('admins').select(1).where('admin_code', admin_code_b).then((rows) => {

        if (!rows.length) {
          throw new Error('This admin doesn\'t exist!');
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
        })

      }).then(() => {
        return knex('events').select().where('event_code', event_code_b)
        .join('times', 'event_id', '=', 'id');
      }).then((rows) => {
        if (rows.length) {
          rows[0].event_date = moment(rows[0].event_date).format('YYYY-MM-DD');
          console.log(rows[0]);
          res.render('edit', { event: rows[0]});
        } else {
          return Promise.reject(new Error('This event doesn\'t exist!'));
        }
      }).catch((err) => {
        res.status(404).send('Error 404: Doesn\'t exist');

      })
  });
  return router;
};

