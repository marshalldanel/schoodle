'use strict';

const express = require('express');
const randStr = require('../public/scripts/make-code');
const router = express.Router();

module.exports = (knex) => {

  // Event page
  router.get('/event/:eventid', (req, res) => {

    // Select event details for event that corresponds to URL
    const eventid = req.params.eventid;
    return knex('events').select('*').where('event_code', eventid).then(raw => {

      // Guard code
      if (!raw.length) {
        res.status(404).send('Page does not exist');
        return;
      } else if (raw[0].deleted_at) {
        res.status(404).send('Page was deleted');
        return;
      }

      // Put data into templateVars
      const event = raw[0];
      const templateVars = {
        address: event.location,
        description: event.description,
        eventname: event.title,
        eventdate: event.event_date,
        eventid: req.params.eventid,
      };

      if (req.session.toggleOn) {
        templateVars.toggleOn = req.session.toggleOn;
      } else {
        templateVars.toggleOn = false;
      }

      // Select event times
      knex('times').select('*').where('event_id', event.id).then(raw => {
        const times = raw[0];
        templateVars.times = [times.time1, times.time2, times.time3, times.time4];

        // Select votes
        knex('polls').select('*').where('event_id', event.id).then(votes => {
          templateVars.votes = {};
          templateVars.deleted = {};

          votes.forEach(vote => {
            if (!vote.deleted_at) {
              templateVars.votes[vote.name] = [vote.time1, vote.time2, vote.time3, vote.time4];
            }
          });

          res.render('poll', templateVars);
        });
      });
    });
  });

  // Delete a vote
  router.post('/event/:eventid/delete', (req, res) => {

    // Select event ID
    return knex('events').select('id').where('event_code', req.params.eventid)
      .then((row) => {

        // Delete poll with matching ID and person name
        return knex('polls').select()
          .where({
            event_id: row[0].id,
            name: req.body.person})
          .update({
            deleted_at: new Date()
          });

      }).then(() => {
        res.redirect(`/event/${req.params.eventid}`);

      }).catch(error => {
        res.status(500).send(error);
      });
  });

  // Edit a vote
  router.post('/event/:eventid/edit', (req, res) => {

    // Select event ID
    return knex('events').select('id').where('event_code', req.params.eventid)
      .then((row) => {

        // Delete poll with matching ID and person name
        return knex('polls').select()
          .where({
            event_id: row[0].id,
            name: req.body.person})
          .update({
            deleted_at: new Date()
          });

      }).then(() => {

        // Set a cookie to toggle and focus on the vote composer
        req.session.toggleOn = true;
        res.redirect(`/event/${req.params.eventid}`);

      }).catch(error => {
        res.status(500).send(error);
      });
  });

  // Create new vote
  router.post('/event/:eventid/new', (req, res) => {
    knex.transaction(() => {

      // Select event that matches event code in URL
      return knex('events').select('id').where('event_code', req.params.eventid)
        .then((row) => {

          // Update the vote table
          return knex('polls')
            .insert({
              event_id: row[0].id,
              name: req.body.voter,
              time1: req.body.time1,
              time2: req.body.time2,
              time3: req.body.time3,
              time4: req.body.time4
            });
        });

    }).then(() => {
      req.session.toggleOn = false;
      res.redirect(`/event/${req.params.eventid}`);

    }).catch(error => {
      res.status(500).send(error);
    });
  });

  return router;
};
