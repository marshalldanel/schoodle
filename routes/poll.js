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
        res.status(404).send('Page does not exist!');
        return;
      } else if (raw[0].deleted_at !== null) {
        res.status(404).send('Page was deleted!');
        return;
      }
      
      const data = raw[0];
      const templateVars = {
        address: data.location,
        description: data.description,
        eventname: data.title,
        eventdate: data.event_date,
        eventid: req.params.eventid
      };
      
      knex('times').select('*').where('event_id', data.id).then(raw => {
        const times = raw[0];
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

// NOT COMPLETED
  // router.post('/event/:eventid/delete', (req, res) => {
  //   const eventid = req.params.eventid;
  //   return knex('events').select('*')
  //     .join('polls', 'events.id', '=', 'event_id')
  //     .where('event_code', eventid)
  //     .then((row) => {
  //       console.log(row);
  //       console.log(votes[person]);
  //       return knex('polls').select('*')
  //         .where('name', row[].name)
  //         .then(() => {
  //           this.closest("tr").addClass("hidden");
  //           res.redirect('/event/:eventid');
  //         });
  //     }).catch((err) => {
  //       res.status(404).send('Attendee doesn\'t exist');
  //     });
  // });


// NOT COMPLETED
  // router.get('/event/:eventid/edit', (req, res) => {
  //   const eventid = req.params.eventid;
  //   knex('events').select().where('event_code', eventid).then((rows) => {
  //     if (rows[0].deleted_at !== null) {
  //       throw new Error('This event doesn\'t exist!');
  //     }
  //   }).then(() => { 
  //     return knex('events').select()
  //       .join('polls', 'events.id', '=', 'event_id')
  //       .where('event_code', eventid)
  //       .where('name', name)
  //       .then(rows => {
  //         return knex('polls').select('*').where('id', '.poll_results > tr.person').then(votes => {
  //           templateVars.votes = {};
  //           $('//').each((votes) => {
  //             $(this).find('td').each(() => {
  //               templateVars.votes[vote.name] = [vote.time1, vote.time2, vote.time3, vote.time4];
  //             });
  //             res.render('poll.ejs', templateVars);
  //           });
  //         });
  //       });
  //   }).catch((err) => {
  //     res.status(404).send('Error 404: Doesn\'t exist');
  //   });
  // });

// NOT COMPLETED
  // router.post('/event/:eventid/update', (req, res) => {
  //   let eventid = req.params.eventid;
  //   knex.transaction(() => {
  //     return (
  //       knex('events').select()
  //       .join('polls', 'events.id', '=', 'event_id')
  //       .where('event_code', eventid)
  //       .where('name', person)
  //       .then(rows => {
  //         return knex('polls').where('event_id', events.id)
  //           .update({
  //             // Update votes?
  //             time1: req.body.time1,
  //             time2: req.body.time2,
  //             time3: req.body.time3,
  //             time4: req.body.time4
  //           });
  //       }).then(() => {
  //         res.redirect(`/event/${eventid}`);
  //       }).catch((err) => {
  //         console.log(err);
  //         res.status(404).send(err);
  //       })
  //     );
  //   });
  // });

  return router;
};

