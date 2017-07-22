'use strict';

const express = require('express');
const router  = express.Router();
const randStr = require('../public/scripts/makeCode');

module.exports = (knex) => {

  // GET poll/invitation page (send to friends)
  router.get('/event/:eventid', (req, res) => {
    const eventid = req.params.eventid;
    return knex('events').select('*').where('event_code', eventid).then(raw => {
      
      if (!raw.length) {
        res.status(404).send('page does not exist');
        return;
      } else if (raw[0].delete_at === null) {
        res.status(404).send('page was deleted');
        return;
      }
      
      const data = raw[0];
      const templateVars = {
        address: data.location,
        description: data.description,
        eventname: data.title,
        eventdate: data.event_date,
      };
      
      knex('times').select('*').where('event_id', data.id).then(raw => {
        const times = raw[0];
        console.log(times);
        templateVars.times = [times.time1, times.time2, times.time3, times.time4];
        
        knex('polls').select('*').where('event_id', data.id).then(votes => {
          templateVars.votes = {};
          votes.forEach(vote => {
            templateVars.votes[vote.name] = [vote.time1, vote.time2, vote.time3, vote.time4];
          });
          res.render('poll.ejs', templateVars);
        });
      });
    });
  });
  
  return router;
};

